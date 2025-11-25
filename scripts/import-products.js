/**
 * Import Products Script
 * 
 * This script imports all products from the spreadsheet data into the database.
 * It creates categories, products, variants, and images.
 * 
 * Usage: node scripts/import-products.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Product data from spreadsheet
const productsData = [
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
      { name: 'Teal Blue / Dark Blue', folder: 'PRIZMA SLING png ( dark green )png' },
      { name: 'Mint Green / Pastel Green', folder: 'PRIZMA SLING png ( PASTEL GREEN ) )' },
      { name: 'Mocha Tan', folder: 'PRIZMA SLING png ( brown )' },
      { name: 'Milky Blue', folder: 'PRIZMA SLING png (milky blue ) )' },
    ],
  },
  {
    name: 'VISTAPACK',
    category: 'Backpack',
    price: 4499,
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'vistapack( dark green )' },
      { name: 'Mint Green / Pastel Green', folder: 'VISTAPACK( green )' },
      { name: 'Mocha Tan', folder: 'vistapack ( brown )' },
      { name: 'Milky Blue', folder: 'vistapack ( blue )' },
    ],
  },
  {
    name: 'SANDESH LAPTOP BAG',
    category: 'Laptop Bag',
    price: 6499,
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'SANDESH LAPTOP BAG dark blue( png )' },
      { name: 'Mint Green / Pastel Green', folder: 'SANDESH LAPTOP BAG png ( green)' },
      { name: 'Mocha Tan', folder: 'SANDESH LAPTOP BAG png brown' },
      { name: 'Milky Blue', folder: 'SANDESH LAPTOP BAG ( MILKY BLUE)' },
    ],
  },
  {
    name: 'Lekha Wallet',
    category: 'Clutch',
    price: 2199,
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'lekha teal blue' },
      { name: 'Mint Green / Pastel Green', folder: 'lekha pastel green png' },
      { name: 'Mocha Tan', folder: 'lekha png brown )' },
      { name: 'Milky Blue', folder: 'lekha milky blue' },
    ],
  },
  {
    name: 'Lekha Wallet',
    category: 'Wallet',
    price: 1999,
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'lekha png (teal blue)' },
      { name: 'Mint Green / Pastel Green', folder: 'lekha png ( pastel green )' },
      { name: 'Mocha Tan', folder: 'lekha png brown )' },
      { name: 'Milky Blue', folder: 'lekha milky blue' },
    ],
  },
]

const imagesBasePath = path.join(__dirname, '../New Folder With Items')

// Helper function to find image files in a folder
function findImagesInFolder(folderName) {
  const possiblePaths = [
    folderName,
    folderName.replace(/[()]/g, ''),
    folderName.replace(/[()]/g, '').trim(),
    folderName.toLowerCase(),
    folderName.toUpperCase(),
  ]

  for (const possiblePath of possiblePaths) {
    const fullPath = path.join(imagesBasePath, possiblePath)
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath)
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
        .sort()
        .map(file => path.join(fullPath, file))
      
      if (files.length > 0) {
        return files
      }
    }
  }

  // Try partial matches
  const allFolders = fs.readdirSync(imagesBasePath)
  const matchingFolder = allFolders.find(folder => 
    folder.toLowerCase().includes(folderName.toLowerCase().replace(/[()]/g, '').trim())
  )

  if (matchingFolder) {
    const fullPath = path.join(imagesBasePath, matchingFolder)
    const files = fs.readdirSync(fullPath)
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .sort()
      .map(file => path.join(fullPath, file))
    
    return files.length > 0 ? files : []
  }

  return []
}

// Helper function to upload image to Supabase Storage
async function uploadImageToStorage(filePath, productName, colorName, imageIndex) {
  try {
    const fileName = path.basename(filePath)
    const fileExt = path.extname(fileName)
    const sanitizedProductName = productName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const sanitizedColorName = colorName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const storagePath = `products/${sanitizedProductName}/${sanitizedColorName}/${imageIndex}${fileExt}`

    const fileBuffer = fs.readFileSync(filePath)

    const { data, error } = await supabase.storage
      .from('category-images') // Using existing bucket, or create 'product-images' bucket
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: true,
      })

    if (error) {
      console.error(`  ❌ Failed to upload ${fileName}:`, error.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('category-images')
      .getPublicUrl(storagePath)

    return publicUrl
  } catch (error) {
    console.error(`  ❌ Error uploading image ${filePath}:`, error.message)
    return null
  }
}

async function createCategory(categoryName) {
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Check if category exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    console.log(`  ✓ Category "${categoryName}" already exists`)
    return existing.id
  }

  // Get max order
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
    console.error(`  ❌ Failed to create category "${categoryName}":`, error.message)
    return null
  }

  console.log(`  ✓ Created category "${categoryName}"`)
  return data.id
}

async function createProduct(productData, categoryId) {
  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Check if product exists
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single()

  let productId

  if (existing) {
    console.log(`  ✓ Product "${productData.name}" already exists, updating...`)
    productId = existing.id

    const { error: updateError } = await supabase
      .from('products')
      .update({
        price: productData.price,
        category_id: categoryId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)

    if (updateError) {
      console.error(`  ❌ Failed to update product:`, updateError.message)
      return null
    }
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
      console.error(`  ❌ Failed to create product "${productData.name}":`, error.message)
      return null
    }

    productId = data.id
    console.log(`  ✓ Created product "${productData.name}"`)
  }

  // Create variants and images
  for (const color of productData.colors) {
    console.log(`    Processing color: ${color.name}`)

    // Find images for this color
    const imageFiles = findImagesInFolder(color.folder)
    
    if (imageFiles.length === 0) {
      console.log(`    ⚠️  No images found for folder: ${color.folder}`)
      continue
    }

    // Create variant
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
      console.error(`    ❌ Failed to create variant:`, variantError.message)
      continue
    }

    const variantId = variantData.id

    // Upload and create images
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i]
      console.log(`      Uploading image ${i + 1}/${imageFiles.length}: ${path.basename(imagePath)}`)

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

        console.log(`      ✓ Uploaded image ${i + 1}`)
      }
    }
  }

  return productId
}

async function main() {
  console.log('🚀 Starting product import...\n')

  // Create categories first
  const categoryMap = {}
  const uniqueCategories = [...new Set(productsData.map(p => p.category))]

  for (const categoryName of uniqueCategories) {
    const categoryId = await createCategory(categoryName)
    if (categoryId) {
      categoryMap[categoryName] = categoryId
    }
  }

  console.log('\n📦 Creating products...\n')

  // Create products
  for (const productData of productsData) {
    const categoryId = categoryMap[productData.category]
    if (!categoryId) {
      console.error(`❌ Category not found for product: ${productData.name}`)
      continue
    }

    console.log(`\n📝 Processing: ${productData.name}`)
    await createProduct(productData, categoryId)
  }

  console.log('\n✅ Import completed!')
}

main().catch(console.error)

