import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

    const results: any[] = []

    // For each product, check storage and sync images
    for (const product of products) {
      const productSlug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      // List files in the product folder
      const { data: files, error: listError } = await supabase.storage
        .from('product-images')
        .list(`products/${productSlug}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (listError) {
        console.warn(`Error listing files for ${product.name}:`, listError.message)
        // Try alternative folder names
        const altSlug = product.name.toLowerCase().replace(/\s+/g, '-')
        const { data: altFiles } = await supabase.storage
          .from('product-images')
          .list(`products/${altSlug}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          })
        
        if (altFiles && altFiles.length > 0) {
          // Process altFiles
          for (let i = 0; i < altFiles.length; i++) {
            const file = altFiles[i]
            if (file.name && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
              const imagePath = `products/${altSlug}/${file.name}`
              const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(imagePath)

              // Check if image already exists
              const { data: existing } = await supabase
                .from('product_images')
                .select('id')
                .eq('product_id', product.id)
                .eq('image_url', publicUrl)
                .single()

              if (!existing) {
                // Create image record
                const { error: insertError } = await supabase
                  .from('product_images')
                  .insert({
                    product_id: product.id,
                    variant_id: null,
                    image_url: publicUrl,
                    alt_text: `${product.name} - Image ${i + 1}`,
                    order: i,
                    is_primary: i === 0,
                  })

                if (insertError) {
                  console.error(`Error inserting image for ${product.name}:`, insertError.message)
                } else {
                  results.push({ product: product.name, image: file.name, status: 'added' })
                }
              }
            }
          }
        }
        continue
      }

      if (!files || files.length === 0) {
        // Try checking subfolders (color variants)
        const { data: folders } = await supabase.storage
          .from('product-images')
          .list(`products/${productSlug}`, {
            limit: 100,
            offset: 0,
          })

        if (folders) {
          for (const folder of folders) {
            if (folder.id) {
              // This is a folder, list its contents
              const { data: folderFiles } = await supabase.storage
                .from('product-images')
                .list(`products/${productSlug}/${folder.name}`, {
                  limit: 100,
                  offset: 0,
                  sortBy: { column: 'name', order: 'asc' }
                })

              if (folderFiles) {
                // Get variant for this color
                const colorName = folder.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                const { data: variant } = await supabase
                  .from('product_variants')
                  .select('id')
                  .eq('product_id', product.id)
                  .ilike('color', `%${colorName}%`)
                  .single()

                for (let i = 0; i < folderFiles.length; i++) {
                  const file = folderFiles[i]
                  if (file.name && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                    const imagePath = `products/${productSlug}/${folder.name}/${file.name}`
                    const { data: { publicUrl } } = supabase.storage
                      .from('product-images')
                      .getPublicUrl(imagePath)

                    // Check if image already exists
                    const { data: existing } = await supabase
                      .from('product_images')
                      .select('id')
                      .eq('product_id', product.id)
                      .eq('image_url', publicUrl)
                      .single()

                    if (!existing) {
                      // Get current max order for this product
                      const { data: maxOrder } = await supabase
                        .from('product_images')
                        .select('order')
                        .eq('product_id', product.id)
                        .order('order', { ascending: false })
                        .limit(1)
                        .single()

                      const nextOrder = (maxOrder?.order ?? -1) + 1

                      // Check if product has any primary image
                      const { data: hasPrimary } = await supabase
                        .from('product_images')
                        .select('id')
                        .eq('product_id', product.id)
                        .eq('is_primary', true)
                        .single()

                      const { error: insertError } = await supabase
                        .from('product_images')
                        .insert({
                          product_id: product.id,
                          variant_id: variant?.id || null,
                          image_url: publicUrl,
                          alt_text: `${product.name} - ${folder.name} - Image ${i + 1}`,
                          order: nextOrder,
                          is_primary: !hasPrimary && i === 0,
                        })

                      if (insertError) {
                        console.error(`Error inserting image for ${product.name}:`, insertError.message)
                      } else {
                        results.push({ product: product.name, image: file.name, status: 'added' })
                      }
                    }
                  }
                }
              }
            }
          }
        }
        continue
      }

      // Process files in the product folder
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.name && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
          const imagePath = `products/${productSlug}/${file.name}`
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(imagePath)

          // Check if image already exists
          const { data: existing } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', product.id)
            .eq('image_url', publicUrl)
            .single()

          if (!existing) {
            // Get current max order for this product
            const { data: maxOrder } = await supabase
              .from('product_images')
              .select('order')
              .eq('product_id', product.id)
              .order('order', { ascending: false })
              .limit(1)
              .single()

            const nextOrder = (maxOrder?.order ?? -1) + 1

            // Check if product has any primary image
            const { data: hasPrimary } = await supabase
              .from('product_images')
              .select('id')
              .eq('product_id', product.id)
              .eq('is_primary', true)
              .single()

            const { error: insertError } = await supabase
              .from('product_images')
              .insert({
                product_id: product.id,
                variant_id: null,
                image_url: publicUrl,
                alt_text: `${product.name} - Image ${i + 1}`,
                order: nextOrder,
                is_primary: !hasPrimary && i === 0,
              })

            if (insertError) {
              console.error(`Error inserting image for ${product.name}:`, insertError.message)
            } else {
              results.push({ product: product.name, image: file.name, status: 'added' })
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
      totalAdded: results.filter(r => r.status === 'added').length,
      totalExists: results.filter(r => r.status === 'exists').length,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Sync images error:', error)
    return NextResponse.json({ error: error.message || 'Failed to sync images' }, { status: 500 })
  }
}

