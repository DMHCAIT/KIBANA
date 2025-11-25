# 🚀 KIBANA Production Deployment Guide

## Your Setup: Vercel + Render + Supabase

This guide will walk you through deploying your KIBANA e-commerce application to production.

---

## 📋 Pre-Deployment Checklist

### ✅ What You Have:
- **Frontend/Backend**: Next.js application
- **Database**: Supabase (already configured)
- **Hosting Options**: Vercel (frontend), Render (backup option)

### ❌ What You Need to Setup:
1. Payment Gateways (Razorpay/Stripe)
2. AI Features (OpenAI - Optional)
3. Email Service (Optional)
4. Domain Name (Optional but recommended)

---

## 🗄️ STEP 1: Supabase Database Setup

### 1.1 Verify Database is Ready
```bash
# Your Supabase project should already have:
- ✅ Database tables (from migrations)
- ✅ RLS policies configured
- ✅ Storage buckets created
```

### 1.2 Create Storage Buckets (if not exists)
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
2. Create these buckets:
   - `product-images` (Public)
   - `category-images` (Public)
   - `banner-images` (Public)

### 1.3 Set Storage Policies
For each bucket, add policy:
```sql
-- Allow public read access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

### 1.4 Get Your Supabase Credentials
From: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (keep secret!)
```

---

## 💳 STEP 2: Payment Gateway Setup

### Option A: Razorpay (Recommended for India)

#### 2.1 Create Razorpay Account
1. Go to: https://razorpay.com/
2. Sign up for account
3. Complete KYC verification
4. Go to: Settings → API Keys

#### 2.2 Get API Keys
```
RAZORPAY_KEY=rzp_live_xxxxx (for production)
RAZORPAY_SECRET=xxxxx (keep secret!)
```

#### 2.3 Test Mode Keys (for testing)
```
RAZORPAY_KEY=rzp_test_xxxxx
RAZORPAY_SECRET=xxxxx
```

#### 2.4 Configure Webhooks (Optional)
- Webhook URL: `https://yourdomain.com/api/payments/razorpay/webhook`
- Events: `payment.captured`, `payment.failed`, `order.paid`

### Option B: Stripe (For Global Payments)

#### 2.5 Create Stripe Account
1. Go to: https://stripe.com/
2. Sign up for account
3. Complete verification
4. Go to: Developers → API Keys

#### 2.6 Get API Keys
```
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

#### 2.7 Configure Webhooks
- Webhook URL: `https://yourdomain.com/api/payments/stripe/webhook`
- Events: `checkout.session.completed`, `payment_intent.succeeded`

---

## 🤖 STEP 3: AI Features Setup (Optional)

### 3.1 OpenAI API
If you want AI-powered search and recommendations:

1. Go to: https://platform.openai.com/api-keys
2. Create API key
3. Add to environment:
```
OPENAI_API_KEY=sk-proj-xxxxx
```

**Note**: If you skip this, AI features will be disabled but store will work fine.

---

## 🌐 STEP 4: Deploy to Vercel (Recommended)

### 4.1 Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/kibana.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

#### Via Vercel Dashboard (Easy):
1. Go to: https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Via Vercel CLI (Alternative):
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 4.3 Add Environment Variables in Vercel
Go to: Project Settings → Environment Variables

**Required Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App URL (use your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# Payment Gateway (add the one you're using)
# For Razorpay:
RAZORPAY_KEY=rzp_live_xxxxx
RAZORPAY_SECRET=xxxxx

# OR For Stripe:
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Optional: AI Features
OPENAI_API_KEY=sk-proj-xxxxx

# Optional: Email
RESEND_API_KEY=re_xxxxx
```

### 4.4 Deploy
Click "Deploy" button in Vercel dashboard or run:
```bash
vercel --prod
```

### 4.5 Custom Domain (Optional)
1. Go to: Project Settings → Domains
2. Add your domain: `www.yourstore.com`
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your domain

---

## 🔄 ALTERNATIVE: Deploy to Render

### 5.1 Create Render Account
1. Go to: https://render.com/
2. Sign up with GitHub

### 5.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: kibana-store
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (for testing) or Starter ($7/month)

### 5.3 Add Environment Variables
Same as Vercel (Step 4.3)

### 5.4 Deploy
Click "Create Web Service" - Render will auto-deploy

**Note**: Render is slower than Vercel for Next.js apps. Vercel is recommended.

---

## 👤 STEP 6: Create Admin User

### 6.1 Run Admin Creation Script
```bash
# From your local machine (with .env.local configured)
node scripts/create-admin.js
```

Follow the prompts to create admin credentials.

### 6.2 Or Manually in Supabase
1. Go to: Supabase Dashboard → Authentication → Users
2. Add new user
3. Go to: SQL Editor and run:
```sql
-- Update user role to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@yourstore.com';
```

---

## 🧪 STEP 7: Post-Deployment Testing

### 7.1 Test Customer Flow
1. ✅ Visit homepage
2. ✅ Browse products
3. ✅ Search products
4. ✅ Add to cart
5. ✅ Register account
6. ✅ Complete checkout
7. ✅ Make test payment (use test mode first!)
8. ✅ Check order confirmation

### 7.2 Test Admin Panel
1. ✅ Login to `/admin`
2. ✅ View dashboard
3. ✅ Add test product
4. ✅ Upload images
5. ✅ Create category
6. ✅ Edit homepage
7. ✅ View orders

### 7.3 Test Payment Gateway
**Razorpay Test Cards:**
- Success: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- 3D Secure: `4000 0027 6000 3184`
- Decline: `4000 0000 0000 0002`

---

## 🔒 STEP 8: Security Checklist

### 8.1 Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for test/production
- ✅ Keep service role keys secret
- ✅ Rotate keys periodically

### 8.2 Supabase RLS
- ✅ Verify RLS policies are enabled
- ✅ Test user can only access their data
- ✅ Admin routes protected

### 8.3 Payment Security
- ✅ Payment verification on server-side
- ✅ Webhook signature verification
- ✅ Amount validation

---

## 📊 STEP 9: Monitoring & Analytics

### 9.1 Vercel Analytics (Included)
Automatically enabled on Vercel:
- Performance monitoring
- Error tracking
- Traffic analytics

### 9.2 Optional: Add Google Analytics
In `app/layout.tsx`, add:
```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX" />
```

### 9.3 Optional: Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🚨 STEP 10: Troubleshooting

### Common Issues:

#### Build Fails on Vercel
```bash
# Check build logs in Vercel dashboard
# Usually missing environment variables
```

#### Images Not Loading
- Check Supabase storage buckets are public
- Verify storage policies are correct
- Check CORS settings in Supabase

#### Payment Not Working
- Verify API keys are correct (test vs live)
- Check webhook URL is accessible
- Look at payment gateway dashboard for errors

#### Database Connection Issues
- Verify Supabase URL and keys
- Check Supabase project is not paused (free tier)
- Verify IP restrictions in Supabase

---

## 📝 STEP 11: Go Live Checklist

### Before Going Live:
- [ ] All environment variables set to PRODUCTION
- [ ] Payment gateway in LIVE mode (not test)
- [ ] Admin user created
- [ ] Test orders completed successfully
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Privacy policy page added
- [ ] Terms & conditions page added
- [ ] Contact information updated
- [ ] Social media links updated
- [ ] Google Analytics configured (optional)
- [ ] Backup plan ready

### After Going Live:
- [ ] Monitor error logs in Vercel
- [ ] Watch payment processing
- [ ] Check order emails
- [ ] Test customer flow
- [ ] Monitor performance
- [ ] Gather feedback

---

## 💰 Cost Breakdown

### Free Tier (For Testing):
- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (500MB database, 1GB storage)
- **Render**: Free (with limitations)
- **Total**: $0/month

### Recommended Production:
- **Vercel Pro**: $20/month (better performance, custom domains)
- **Supabase Pro**: $25/month (8GB database, 100GB storage)
- **Razorpay**: Transaction fees only (2% + ₹0 per transaction)
- **Domain**: $10-15/year (optional)
- **Total**: $45-50/month + transaction fees

### High Traffic:
- **Vercel Enterprise**: Custom pricing
- **Supabase Team**: $599/month
- **CDN**: Cloudflare (free) or AWS CloudFront

---

## 🔗 Important URLs

### Development:
- Local: http://localhost:3000
- Admin: http://localhost:3000/admin

### Production (After Deployment):
- Store: https://your-project.vercel.app
- Admin: https://your-project.vercel.app/admin
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Razorpay Dashboard: https://dashboard.razorpay.com
- Stripe Dashboard: https://dashboard.stripe.com

---

## 📞 Support & Resources

### Documentation:
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Razorpay: https://razorpay.com/docs
- Stripe: https://stripe.com/docs

### Community:
- Next.js Discord: https://nextjs.org/discord
- Supabase Discord: https://supabase.com/discord

---

## 🎯 Quick Start (Fastest Way to Deploy)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import GitHub repo
# - Add environment variables from env.template
# - Click Deploy

# 3. Setup Supabase
# - Create storage buckets
# - Run migrations
# - Create admin user

# 4. Setup Payment Gateway
# - Get Razorpay keys
# - Add to Vercel environment variables
# - Redeploy

# 5. Test Everything
# - Make test purchase
# - Check admin panel
# - Verify orders work

# Done! 🎉
```

---

## ✅ Final Notes

1. **Start with Test Mode**: Always test payments with test keys first
2. **Monitor Closely**: Watch error logs for first few days
3. **Backup Regularly**: Supabase has daily backups on Pro plan
4. **Scale Gradually**: Start with free tier, upgrade as needed
5. **Keep Keys Safe**: Never expose API keys in client-side code

**Your deployment is ready! 🚀**

For help, check the DEPLOYMENT_CHECKLIST.md file.
