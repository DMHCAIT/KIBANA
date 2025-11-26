/**
 * Product Import Library
 * 
 * This module contains the core import logic that can be used
 * both from the CLI script and the API route.
 */

import { createAdminClient } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'

const supabase = createAdminClient()

// Product data from spreadsheet
export const productsData = [
  {
    name: 'VISTARA TOTE',
    category: 'Tote Bag',
    price: 4999,
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'png( teal blue' },
      { name: 'Mint Green / Pastel Green', folder: 'png( pastel green)' },
      { name: 'Mocha Tan', folder: 'png ( brown )' },
      { name: 'Milky Blue', folder: 'png( milkey blue )' },
    ],
  },
  {
    name: 'PRIZMA SLING',
    category: 'Sling Bag',
    price: 3999,
    colors: [
      { name: 'Dark Green', folder: 'PRIZMA SLING png ( dark green )png' },
      { name: 'Pastel Green', folder: 'PRIZMA SLING png ( PASTEL GREEN ) )' },
      { name: 'Mocha Tan', folder: 'PRIZMA SLING png ( brown )' },
      { name: 'Milky Blue', folder: 'PRIZMA SLING png (milky blue ) )' },
    ],
  },
  {
    name: 'VISTAPACK',
    category: 'Backpack',
    price: 4499,
    colors: [
      { name: 'Dark Green', folder: 'vistapack( dark green )' },
      { name: 'Green', folder: 'VISTAPACK( green )' },
      { name: 'Mocha Tan', folder: 'vistapack ( brown )' },
      { name: 'Blue', folder: 'vistapack ( blue )' },
    ],
  },
  {
    name: 'SANDESH LAPTOP BAG',
    category: 'Laptop Bag',
    price: 6499,
    colors: [
      { name: 'Dark Blue', folder: 'SANDESH LAPTOP BAG dark blue( png )' },
      { name: 'Green', folder: 'SANDESH LAPTOP BAG png ( green)' },
      { name: 'Mocha Tan', folder: 'SANDESH LAPTOP BAG png brown' },
      { name: 'Milky Blue', folder: 'SANDESH LAPTOP BAG ( MILKY BLUE)' },
    ],
  },
  {
    name: 'Lekha Wallet',
    category: 'Clutch',
    price: 2199,
    colors: [
      { name: 'Teal Blue', folder: 'lekha teal blue' },
      { name: 'Pastel Green', folder: 'lekha pastel green png' },
      { name: 'Mocha Tan', folder: 'lekha png brown )' },
      { name: 'Milky Blue', folder: 'lekha milky blue' },
    ],
  },
  {
    name: 'Lekha Wallet',
    category: 'Wallet',
    price: 1999,
    colors: [
      { name: 'Teal Blue', folder: 'lekha png ( pastel green )' },
      { name: 'Pastel Green', folder: 'lekha png ( pastel green )' },
    ],
  },
]

export function getImagesBasePath() {
  // In production/Vercel, we can't access local files
  // Images should already be uploaded or we need a different approach
  const possiblePaths = [
    path.join(process.cwd(), 'New Folder With Items'),
    path.join(process.cwd(), '..', 'New Folder With Items'),
  ]
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath
    }
  }
  
  return null
}

export function findImagesInFolder(folderName: string, imagesBasePath: string | null): string[] {
  if (!imagesBasePath) return []

  const normalize = (str: string) => str.toLowerCase().replace(/[()]/g, '').trim().replace(/\s+/g, ' ')
  
  const normalizedTarget = normalize(folderName)
  const allFolders = fs.readdirSync(imagesBasePath)
  
  // Try exact match first
  for (const folder of allFolders) {
    if (normalize(folder) === normalizedTarget) {
      const fullPath = path.join(imagesBasePath, folder)
      if (fs.statSync(fullPath).isDirectory()) {
        const files = fs.readdirSync(fullPath)
          .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
          .sort()
          .map(file => path.join(fullPath, file))
        
        if (files.length > 0) {
          return files
        }
      }
    }
  }

  // Try partial/fuzzy matches
  for (const folder of allFolders) {
    const normalizedFolder = normalize(folder)
    const targetWords = normalizedTarget.split(' ').filter(w => w.length > 2)
    const folderWords = normalizedFolder.split(' ').filter(w => w.length > 2)
    
    const matchingWords = targetWords.filter(word => 
      folderWords.some(fw => fw.includes(word) || word.includes(fw))
    )
    
    if (matchingWords.length >= Math.min(2, targetWords.length)) {
      const fullPath = path.join(imagesBasePath, folder)
      if (fs.statSync(fullPath).isDirectory()) {
        const files = fs.readdirSync(fullPath)
          .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
          .sort()
          .map(file => path.join(fullPath, file))
        
        if (files.length > 0) {
          return files
        }
      }
    }
  }

  return []
}

export async function uploadImageToStorage(filePath: string, productName: string, colorName: string, imageIndex: number): Promise<string | null> {
  try {
    const fileName = path.basename(filePath)
    const fileExt = path.extname(fileName)
    const sanitizedProductName = productName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const sanitizedColorName = colorName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const storagePath = `products/${sanitizedProductName}/${sanitizedColorName}/${imageIndex}${fileExt}`

    const fileBuffer = fs.readFileSync(filePath)

    // Try product-images bucket first, fallback to category-images
    let bucket = 'product-images'
    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: true,
      })

    if (error && error.message.includes('not found')) {
      bucket = 'category-images'
      const result = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${fileExt.slice(1)}`,
          upsert: true,
        })
      data = result.data
      error = result.error
    }

    if (error) {
      console.error(`Failed to upload ${fileName}:`, error.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath)

    return publicUrl
  } catch (error: any) {
    console.error(`Error uploading image ${filePath}:`, error.message)
    return null
  }
}

export async function createCategory(categoryName: string): Promise<string | null> {
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return existing.id
  }

  const { data: maxOrderData } = await supabase
    .from('categories')
    .select('order')
    .order('order', { ascending: false })
    .limit(1)
    .single()

  const newOrder = (maxOrderData?.order || 0) + 1

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryName,
      slug,
      is_active: true,
      order: newOrder,
    })
    .select()
    .single()

  if (error) {
    console.error(`Failed to create category "${categoryName}":`, error.message)
    return null
  }

  return data.id
}

export async function createProduct(productData: typeof productsData[0], categoryId: string, imagesBasePath: string | null): Promise<string | null> {
  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single()

  let productId: string

  if (existing) {
    productId = existing.id
    await supabase
      .from('products')
      .update({
        price: productData.price,
        category_id: categoryId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug,
        brand: 'KIBANA',
        description: `Premium ${productData.name} - Luxury handcrafted design`,
        short_description: `Premium ${productData.name}`,
        price: productData.price,
        category_id: categoryId,
        is_active: true,
        is_featured: false,
        stock_status: 'in_stock',
      })
      .select()
      .single()

    if (error) {
      console.error(`Failed to create product "${productData.name}":`, error.message)
      return null
    }

    productId = data.id
  }

  // Create variants and images
  for (const color of productData.colors) {
    const imageFiles = imagesBasePath ? findImagesInFolder(color.folder, imagesBasePath) : []
    
    if (imageFiles.length === 0 && imagesBasePath) {
      console.log(`No images found for folder: ${color.folder}`)
      continue
    }

    // Check if variant exists
    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('color', color.name)
      .single()

    let variantId: string
    if (existingVariant) {
      variantId = existingVariant.id
    } else {
      const sku = `${slug}-${color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
      
      const { data: variantData, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          color: color.name,
          sku,
          price: productData.price,
          stock_quantity: 10,
          is_active: true,
        })
        .select()
        .single()

      if (variantError) {
        console.error(`Failed to create variant:`, variantError.message)
        continue
      }

      variantId = variantData.id
    }

    // Check if images already exist
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('id')
      .eq('variant_id', variantId)

    if (existingImages && existingImages.length > 0) {
      continue
    }

    // Upload and create images (only if we have local files)
    if (imagesBasePath && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const imagePath = imageFiles[i]
        const imageUrl = await uploadImageToStorage(imagePath, productData.name, color.name, i)

        if (imageUrl) {
          await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              variant_id: variantId,
              image_url: imageUrl,
              alt_text: `${productData.name} - ${color.name} - Image ${i + 1}`,
              order: i,
              is_primary: i === 0,
            })
        }
      }
    }
  }

  return productId
}

export async function importAllProducts(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const imagesBasePath = getImagesBasePath()
    
    if (!imagesBasePath) {
      return {
        success: false,
        message: 'Image folders not found. Please ensure images are uploaded manually or run the script locally.',
      }
    }

    // Create categories
    const categoryMap: Record<string, string> = {}
    const uniqueCategories = [...new Set(productsData.map(p => p.category))]

    for (const categoryName of uniqueCategories) {
      const categoryId = await createCategory(categoryName)
      if (categoryId) {
        categoryMap[categoryName] = categoryId
      }
    }

    // Create products
    const results = []
    for (const productData of productsData) {
      const categoryId = categoryMap[productData.category]
      if (!categoryId) {
        results.push({ product: productData.name, status: 'failed', error: 'Category not found' })
        continue
      }

      const productId = await createProduct(productData, categoryId, imagesBasePath)
      results.push({ 
        product: productData.name, 
        status: productId ? 'success' : 'failed' 
      })
    }

    return {
      success: true,
      message: `Imported ${results.filter(r => r.status === 'success').length} products`,
      details: results,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Import failed',
    }
  }
}

