# 🚀 Quick Vercel Deployment Guide

## What You Need to Add in Vercel

### 1. **Environment Variables** (CRITICAL - Add these before deploying)

Go to: **Project Settings → Environment Variables** in Vercel dashboard

#### Required Environment Variables:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL (REQUIRED - Update after first deployment)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

#### Payment Gateway (Choose ONE):

**For Razorpay:**
```bash
RAZORPAY_KEY=rzp_test_xxxxx  # Use rzp_live_xxxxx for production
RAZORPAY_SECRET=your_razorpay_secret
```

**OR For Stripe:**
```bash
STRIPE_SECRET_KEY=sk_test_xxxxx  # Use sk_live_xxxxx for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # Use pk_live_xxxxx for production
```

#### Optional (AI Features):
```bash
OPENAI_API_KEY=sk-proj-xxxxx
```

#### Optional (Email Service):
```bash
RESEND_API_KEY=re_xxxxx
```

---

### 2. **Build Settings** (Usually Auto-Detected)

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build` (or `npm install && npm run build`)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Root Directory**: `./` (if your project is in the root)

---

### 3. **Deployment Steps**

1. **Import Repository**
   - Click "Add New" → "Project" in Vercel
   - Select your GitHub repository: `DMHCAIT/KIBANA`
   - Select branch: `main`

2. **Configure Project**
   - Project Name: `kibana` (or your preferred name)
   - Framework: Should auto-detect as `Next.js`
   - Root Directory: `./` (leave as default)

3. **Add Environment Variables**
   - Click "Environment Variables" section
   - Add all variables from section 1 above
   - Make sure to select all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete (usually 2-3 minutes)

5. **Update App URL**
   - After first deployment, copy your Vercel URL (e.g., `https://kibana-xyz.vercel.app`)
   - Go back to Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
   - Redeploy

---

### 4. **Post-Deployment Checklist**

After deployment, verify:

- [ ] Homepage loads: `https://your-project.vercel.app`
- [ ] Admin panel accessible: `https://your-project.vercel.app/admin`
- [ ] Database connection works (check browser console for errors)
- [ ] Images load from Supabase Storage
- [ ] Payment gateway configured (if using)

---

### 5. **Common Issues & Solutions**

#### Build Fails
- **Issue**: Missing environment variables
- **Solution**: Add all required environment variables in Vercel dashboard

#### Images Not Loading
- **Issue**: Supabase Storage buckets not configured
- **Solution**: Create buckets in Supabase: `product-images`, `category-images`, `banner-images`

#### Database Connection Error
- **Issue**: Wrong Supabase URL or keys
- **Solution**: Double-check environment variables match your Supabase project

#### Payment Not Working
- **Issue**: Payment gateway keys not set or wrong mode (test vs live)
- **Solution**: Verify API keys in environment variables

---

### 6. **Quick Reference**

**Where to Get Supabase Keys:**
- https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

**Where to Get Razorpay Keys:**
- https://dashboard.razorpay.com/app/keys

**Where to Get Stripe Keys:**
- https://dashboard.stripe.com/apikeys

**Vercel Dashboard:**
- https://vercel.com/dashboard

---

### 7. **Environment Variable Priority**

Vercel uses environment variables in this order:
1. Production (for production deployments)
2. Preview (for pull request previews)
3. Development (for local development with Vercel CLI)

**Tip**: Add variables to all three environments for consistency.

---

## ✅ Ready to Deploy!

1. Add all environment variables in Vercel
2. Click "Deploy"
3. Wait for build to complete
4. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
5. Redeploy
6. Test your application

**That's it! Your app should be live on Vercel! 🎉**

