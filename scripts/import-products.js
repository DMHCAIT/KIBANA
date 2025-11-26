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

// Product data with complete details
const productsData = [
  {
    name: 'VISTARA TOTE',
    category: 'Tote Bag',
    price: 4999,
    brand: 'KIBANA',
    description: `VISTARA- (means "expanse", also hints at the V-shape)

Youth-Trendy Brand Style (Bold, Catchy, Fashionable)

VISTARA– Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style.

Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.`,
    short_description: 'Bold. Stylish. Limitless. The VISTARA TOTE brings a fresh vibe to everyday fashion with its striking V-shape pattern.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Magnetic Flap with concealed zipper top',
      compartments: 'One Main Compartment/Flap/Top Zipper, padded laptop sleeve, inner zip pocket, organizer slip pockets',
      hardware: 'Gold-Tone Accents',
      shoulderDrop: 'Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)',
      capacity: 'Approx. 14–16 Liters – fits laptop, diary, wallet, makeup pouch, charger, and daily essentials',
      idealFor: 'Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality',
      features: ['"V" stitching', 'Structured shape', 'Elegant design']
    },
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
    brand: 'KIBANA',
    description: `PRIZMA– Luxury–Chic Sling

PRIZMA – Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. Bold geometric cuts and golden clasp create a striking statement, blending modern artistry with timeless elegance. PRIZMA is designed for women who shine in every dimension — sophisticated, confident, and effortlessly stylish.

PRIZMA is sophistication made effortless. Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it's built for the confident woman who loves to stand out. Carry Prizma and shine at every angle.`,
    short_description: 'Inspired by the brilliance of a prism, PRIZMA reflects bold geometry and refined craftsmanship.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Square metallic push-lock (gold finish)',
      compartments: 'Main compartment (spacious enough for essentials), internal zipper pocket, slip pocket for phone/cards',
      hardware: 'Gold-Tone Accents',
      shoulderDrop: '26 cm (adjustable strap included)',
      capacity: 'Approx. 4–5 Liters – perfect for essentials like wallet, phone, sunglasses, and small accessories',
      idealFor: 'Evening outings, brunch, parties, and as a chic companion to formal or festive wear'
    },
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
    brand: 'KIBANA',
    description: `VISTAPACK– simple, sleek, direct fusion (Vistara + Backpack).

"VISTAPACK– Where Structure Meets Style"

Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far. Its ergonomic straps embrace you in comfort, while the compact yet functional interior ensures your belongings stay organized wherever life takes you. Just as horizons open up with every step forward, the VISTAPACK symbolizes exploration and resilience, making it a timeless gesture of empowerment and elegance for the modern soul.`,
    short_description: 'Where Structure Meets Style. A modern emblem of strength, style, and versatility.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Main top zipper closure, Front Flap Pocket: Envelope-style pocket for quick essentials',
      compartments: '1 padded compartment (fits iPad / small tablet, up to 11"), 1 zipper pocket, 2 slip pockets (cards, phone, keys)',
      hardware: 'Gold-Tone Accents',
      shoulderDrop: 'Adjustable 90 – 130 cm (so it works for both shoulder carry and crossbody)',
      capacity: 'Approx. 10–12 Liters',
      idealFor: 'College, casual workdays, city travel, and leisure outings'
    },
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
    brand: 'KIBANA',
    description: `Sandesh Laptop Bag – Carry Your Story. Own Your Style.

Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between. From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.

This highlights the design (envelope flap, geometric layering), functionality (fits laptop, secure zip, front pocket), and luxury feel (textured leather, bold mustard color).`,
    short_description: 'Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Magnetic Flap with concealed zipper for secure storage',
      compartments: 'One main padded compartment (fits 14"–15.6" laptop), One front envelope-style pocket for documents/tablet, Internal zipper pocket + slip pockets for phone & cards',
      hardware: 'Gold-Tone Accents',
      shoulderDrop: 'Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)',
      capacity: 'Approx. 12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials',
      idealFor: 'Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity'
    },
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
    brand: 'KIBANA',
    description: `Lekha Wallet – A statement of elegance in every line.

Lekha Wallet – Write Your Style.

Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.

This works beautifully as a pair with Sandesh Laptop Bag— you can position them as part of the Indian-rooted "Message & Writing" collection (Sandesh = Message, Lekha = Writing).`,
    short_description: 'Write Your Style. A statement of elegance in every line.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Zip-Around Closure with envelope-style panel design',
      compartments: '2 main cash compartments, 1 center zipper pocket for coins, 6–8 card slots, 2 slip pockets for bills/receipts',
      hardware: 'Gold-Tone Accents (zipper puller & trims)',
      shoulderDrop: '26 cm (adjustable strap included)',
      capacity: 'Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)',
      idealFor: 'Everyday use, evening outings, and as a stylish companion for both casual and professional looks'
    },
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
    brand: 'KIBANA',
    description: `Lekha Wallet – A statement of elegance in every line.

Lekha Wallet – Write Your Style.

Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.`,
    short_description: 'Write Your Style. A statement of elegance in every line.',
    specifications: {
      dimensions: {
        length: '38 cm',
        width: '14 cm',
        height: '28 cm'
      },
      material: '100% PU Leather',
      texture: 'Smooth, Fine-Grained',
      closure: 'Zip-Around Closure with envelope-style panel design',
      compartments: '2 main cash compartments, 1 center zipper pocket for coins, 6–8 card slots, 2 slip pockets for bills/receipts',
      hardware: 'Gold-Tone Accents (zipper puller & trims)',
      shoulderDrop: '26 cm (adjustable strap included)',
      capacity: 'Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)',
      idealFor: 'Everyday use, evening outings, and as a stylish companion for both casual and professional looks'
    },
    colors: [
      { name: 'Teal Blue / Dark Blue', folder: 'lekha png ( pastel green )' },
      { name: 'Mint Green / Pastel Green', folder: 'lekha png ( pastel green )' },
    ],
  },
]

const imagesBasePath = path.join(__dirname, '../New Folder With Items')

// Helper function to find image files in a folder
function findImagesInFolder(folderName) {
  // Normalize folder name for matching
  const normalize = (str) => str.toLowerCase().replace(/[()]/g, '').trim().replace(/\s+/g, ' ')
  
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
    
    // Check if most words match
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
          console.log(`    📁 Matched folder: "${folder}" for "${folderName}"`)
          return files
        }
      }
    }
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

    // Try product-images bucket first, fallback to category-images
    let bucket = 'product-images'
    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExt.slice(1)}`,
        upsert: true,
      })

    // If product-images bucket doesn't exist, try category-images
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
      console.error(`  ❌ Failed to upload ${fileName}:`, error.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
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
    // Build specifications JSON
    const specifications = productData.specifications ? JSON.stringify(productData.specifications) : null
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        slug,
        brand: productData.brand || 'KIBANA',
        description: productData.description || `Premium ${productData.name} - Luxury handcrafted design`,
        short_description: productData.short_description || `Premium ${productData.name}`,
        price: productData.price,
        category_id: categoryId,
        is_active: true,
        is_featured: false,
        stock_status: 'in_stock',
        seo_title: productData.name,
        seo_description: productData.short_description || productData.description?.substring(0, 160),
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

    // Check if variant already exists
    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('color', color.name)
      .single()

    let variantId
    if (existingVariant) {
      variantId = existingVariant.id
      console.log(`    ✓ Variant "${color.name}" already exists`)
    } else {
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

      variantId = variantData.id
      console.log(`    ✓ Created variant "${color.name}"`)
    }

    // Check if images already exist for this variant
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('id')
      .eq('variant_id', variantId)

    if (existingImages && existingImages.length > 0) {
      console.log(`    ⚠️  Images already exist for variant "${color.name}", skipping upload`)
      continue
    }

    // Upload and create images
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i]
      console.log(`      Uploading image ${i + 1}/${imageFiles.length}: ${path.basename(imagePath)}`)

      const imageUrl = await uploadImageToStorage(imagePath, productData.name, color.name, i)

      if (imageUrl) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            variant_id: variantId,
            image_url: imageUrl,
            alt_text: `${productData.name} - ${color.name} - Image ${i + 1}`,
            order: i,
            is_primary: i === 0,
          })

        if (imageError) {
          console.error(`      ❌ Failed to save image:`, imageError.message)
        } else {
          console.log(`      ✓ Uploaded and saved image ${i + 1}`)
        }
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

