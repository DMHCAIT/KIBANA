import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Helper to normalize folder/product names for matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .trim()
}

// Helper to check if two names match (fuzzy matching)
function namesMatch(productName: string, folderName: string): boolean {
  const normalizedProduct = normalizeName(productName)
  const normalizedFolder = normalizeName(folderName)
  
  // Exact match
  if (normalizedProduct === normalizedFolder) return true
  
  // Check if product name contains folder name or vice versa
  if (normalizedProduct.includes(normalizedFolder) || normalizedFolder.includes(normalizedProduct)) {
    return true
  }
  
  // Check word-by-word matching
  const productWords = normalizedProduct.split('-').filter(w => w.length > 2)
  const folderWords = normalizedFolder.split('-').filter(w => w.length > 2)
  
  if (productWords.length === 0 || folderWords.length === 0) return false
  
  const matchingWords = productWords.filter(word => 
    folderWords.some(fw => fw.includes(word) || word.includes(fw))
  )
  
  // If at least 50% of words match, consider it a match
  return matchingWords.length >= Math.ceil(Math.min(productWords.length, folderWords.length) * 0.5)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug')

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 400 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products found' }, { status: 400 })
    }

    // First, list all folders in the root of product-images bucket
    const { data: rootFolders, error: rootError } = await supabase.storage
      .from('product-images')
      .list('', {
        limit: 1000,
        offset: 0,
      })

    if (rootError) {
      console.error('Error listing root folders:', rootError.message)
    }

    const results: any[] = []
    const debugInfo: any[] = []

    // For each product, try to find matching folders
    for (const product of products) {
      const productSlug = normalizeName(product.slug || product.name)
      let matchedFolder: string | null = null
      let folderPath = ''

      // Try to find matching folder in root
      if (rootFolders) {
        for (const folder of rootFolders) {
          if (folder.id && namesMatch(product.name, folder.name)) {
            matchedFolder = folder.name
            folderPath = folder.name
            break
          }
        }
      }

      // If not found in root, try products/ subfolder
      if (!matchedFolder) {
        const { data: productsFolders } = await supabase.storage
          .from('product-images')
          .list('products', {
            limit: 1000,
            offset: 0,
          })

        if (productsFolders) {
          for (const folder of productsFolders) {
            if (folder.id && namesMatch(product.name, folder.name)) {
              matchedFolder = folder.name
              folderPath = `products/${folder.name}`
              break
            }
          }
        }
      }

      if (!matchedFolder) {
        debugInfo.push({ product: product.name, slug: productSlug, status: 'no_folder_found' })
        continue
      }

      // List files in the matched folder
      const { data: files, error: listError } = await supabase.storage
        .from('product-images')
        .list(folderPath, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (listError) {
        debugInfo.push({ product: product.name, folder: folderPath, error: listError.message })
        continue
      }

      if (!files || files.length === 0) {
        // Check if it's a folder containing subfolders (color variants)
        const { data: subFolders } = await supabase.storage
          .from('product-images')
          .list(folderPath, {
            limit: 1000,
            offset: 0,
          })

        if (subFolders && subFolders.length > 0) {
          // Process subfolders (color variants)
          for (const subFolder of subFolders) {
            if (subFolder.id) {
              // This is a folder, list its contents
              const subFolderPath = folderPath ? `${folderPath}/${subFolder.name}` : subFolder.name
              const { data: subFolderFiles } = await supabase.storage
                .from('product-images')
                .list(subFolderPath, {
                  limit: 1000,
                  offset: 0,
                  sortBy: { column: 'name', order: 'asc' }
                })

              if (subFolderFiles && subFolderFiles.length > 0) {
                // Get variant for this color (try to match by folder name)
                const colorName = subFolder.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                const { data: variant } = await supabase
                  .from('product_variants')
                  .select('id')
                  .eq('product_id', product.id)
                  .or(`color.ilike.%${colorName}%,color.ilike.%${subFolder.name}%`)
                  .limit(1)
                  .maybeSingle()

                // Get current max order for this product
                const { data: maxOrderData } = await supabase
                  .from('product_images')
                  .select('order')
                  .eq('product_id', product.id)
                  .order('order', { ascending: false })
                  .limit(1)
                  .maybeSingle()

                const nextOrder = (maxOrderData?.order ?? -1) + 1

                // Check if product has any primary image
                const { data: hasPrimary } = await supabase
                  .from('product_images')
                  .select('id')
                  .eq('product_id', product.id)
                  .eq('is_primary', true)
                  .limit(1)
                  .maybeSingle()

                for (let i = 0; i < subFolderFiles.length; i++) {
                  const file = subFolderFiles[i]
                  if (file.name && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
                    const imagePath = `${subFolderPath}/${file.name}`
                    const { data: { publicUrl } } = supabase.storage
                      .from('product-images')
                      .getPublicUrl(imagePath)

                    // Check if image already exists
                    const { data: existing } = await supabase
                      .from('product_images')
                      .select('id')
                      .eq('product_id', product.id)
                      .eq('image_url', publicUrl)
                      .limit(1)
                      .maybeSingle()

                    if (!existing) {
                      const { error: insertError } = await supabase
                        .from('product_images')
                        .insert({
                          product_id: product.id,
                          variant_id: variant?.id || null,
                          image_url: publicUrl,
                          alt_text: `${product.name} - ${subFolder.name} - Image ${i + 1}`,
                          order: nextOrder + i,
                          is_primary: !hasPrimary && i === 0 && nextOrder === 0,
                        })

                      if (insertError) {
                        console.error(`Error inserting image for ${product.name}:`, insertError.message)
                        debugInfo.push({ product: product.name, image: file.name, error: insertError.message })
                      } else {
                        results.push({ product: product.name, image: file.name, folder: subFolderPath, status: 'added' })
                      }
                    } else {
                      results.push({ product: product.name, image: file.name, status: 'exists' })
                    }
                  }
                }
              }
            }
          }
        }
        continue
      }

      // Process files directly in the folder
      // Get current max order for this product
      const { data: maxOrderData } = await supabase
        .from('product_images')
        .select('order')
        .eq('product_id', product.id)
        .order('order', { ascending: false })
        .limit(1)
        .maybeSingle()

      const nextOrder = (maxOrderData?.order ?? -1) + 1

      // Check if product has any primary image
      const { data: hasPrimary } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', product.id)
        .eq('is_primary', true)
        .limit(1)
        .maybeSingle()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.name && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
          const imagePath = folderPath ? `${folderPath}/${file.name}` : file.name
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(imagePath)

          // Check if image already exists
          const { data: existing } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', product.id)
            .eq('image_url', publicUrl)
            .limit(1)
            .maybeSingle()

          if (!existing) {
            const { error: insertError } = await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                variant_id: null,
                image_url: publicUrl,
                alt_text: `${product.name} - Image ${i + 1}`,
                order: nextOrder + i,
                is_primary: !hasPrimary && i === 0 && nextOrder === 0,
              })

            if (insertError) {
              console.error(`Error inserting image for ${product.name}:`, insertError.message)
              debugInfo.push({ product: product.name, image: file.name, error: insertError.message })
            } else {
              results.push({ product: product.name, image: file.name, folder: folderPath, status: 'added' })
            }
          } else {
            results.push({ product: product.name, image: file.name, status: 'exists' })
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Synced images for ${products.length} products`,
      results,
      debugInfo,
      totalAdded: results.filter(r => r.status === 'added').length,
      totalExists: results.filter(r => r.status === 'exists').length,
      totalNotFound: debugInfo.filter(d => d.status === 'no_folder_found').length,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Sync images error:', error)
    return NextResponse.json({ error: error.message || 'Failed to sync images' }, { status: 500 })
  }
}
