# 🚀 KIBANA E-Commerce Platform - Setup Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Razorpay account (for Indian payments)
- Stripe account (for global payments)
- OpenAI API key (for AI features)

---

## Step 1: Clone and Install Dependencies

```bash
cd kibana
npm install
```

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2.2 Run Database Migration

1. Go to SQL Editor in Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL script
4. This will create all necessary tables:
   - users
   - categories
   - products
   - product_variants
   - product_images
   - orders
   - order_items
   - cart
   - wishlist
   - reviews
   - banners
   - coupons
   - home_settings

### 2.3 Set Up Storage Buckets

1. Go to Storage in Supabase dashboard
2. Create the following buckets:
   - `product-images` (Public)
   - `category-images` (Public)
   - `banner-images` (Public)

3. Set bucket policies (allow public read, authenticated write):
   ```sql
   -- Product images bucket policy
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'product-images');
   
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'product-images' AND
     auth.role() = 'authenticated'
   );
   ```

### 2.4 Configure Row Level Security (RLS)

The migration script includes RLS policies, but verify:
- Users can only see their own cart/wishlist
- Products are publicly readable
- Orders are user-specific

---

## Step 3: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Gateways
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# AI Features
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Email Service (for notifications)
RESEND_API_KEY=your_resend_api_key
```

---

## Step 4: Set Up Payment Gateways

### 4.1 Razorpay (India)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard → Settings → API Keys
3. Add keys to `.env.local`
4. Set up webhook (optional):
   - Webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Events: `payment.captured`, `payment.failed`

### 4.2 Stripe (Global)

1. Sign up at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API keys
3. Add keys to `.env.local`
4. Set up webhook:
   - Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`

---

## Step 5: Set Up OpenAI (Optional)

1. Sign up at [openai.com](https://openai.com)
2. Get your API key from API Keys section
3. Add to `.env.local`
4. AI features will work automatically:
   - AI-powered search
   - Product recommendations
   - Chat support

---

## Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Step 7: Initial Setup

### 7.1 Create Admin User

1. Register a new account at `/register`
2. Go to Supabase dashboard → Authentication → Users
3. Find your user and update the `users` table:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 7.2 Create Categories

1. Go to `/admin/categories`
2. Click "Add Category"
3. Create your product categories

### 7.3 Add Products

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in product details
4. Upload images
5. Add variants (colors, sizes, etc.)

### 7.4 Configure Homepage

1. Go to `/admin/homepage`
2. Drag and drop sections
3. Configure each section
4. Save changes

---

## Step 8: Deploy to Production

### 8.1 Deploy Frontend (Vercel - Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### 8.2 Alternative: Deploy to Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables
4. Deploy

### 8.3 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your production domain:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Step 9: Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test payment (Razorpay/Stripe)
- [ ] Test admin login
- [ ] Test product creation
- [ ] Test order management
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure email service
- [ ] Set up analytics (Google Analytics, etc.)

---

## Troubleshooting

### Images Not Uploading

1. Check Supabase Storage bucket permissions
2. Verify bucket policies
3. Check file size limits (default: 50MB)

### Payment Not Working

1. Verify API keys are correct
2. Check webhook URLs
3. Verify order creation in database
4. Check browser console for errors

### Authentication Issues

1. Verify Supabase URL and keys
2. Check RLS policies
3. Verify email confirmation settings

### Build Errors

1. Run `npm install` again
2. Clear `.next` folder: `rm -rf .next`
3. Rebuild: `npm run build`

---

## Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Check Supabase dashboard logs
4. Review payment gateway dashboards

---

## Next Steps

- Customize branding and colors
- Add more products
- Configure email templates
- Set up analytics
- Configure SEO
- Add custom domain
- Set up CDN for images
- Configure caching

---

**Happy Selling! 🎉**

