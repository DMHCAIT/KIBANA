# �️ KIBANA - Premium Handbag E-commerce Store

A modern, full-stack e-commerce platform built with Next.js 15, featuring a customer storefront, admin dashboard, and comprehensive order management system.

![KIBANA Store](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

### 🛍️ Storefront
- **Modern Homepage** with video backgrounds, parallax effects, and GSAP animations
- **Advanced Product Listing** with filters, sorting, grid/list views, and pagination
- **Rich Product Pages** with image zoom, fullscreen gallery, reviews, and AI recommendations
- **Smart Shopping Cart** with save for later, quantity validation, and coupons
- **Seamless Checkout** with address management and multiple payment options
- **Wishlist** with filters and sharing
- **AI-Powered Search** with natural language processing
- **User Accounts** with profile, orders, and address management

### 🛠️ Admin CMS
- **Dashboard** with analytics, charts, and recent activity
- **Product Management** with image upload, variants, and bulk operations
- **Category Management** with drag-and-drop ordering
- **Order Management** with status updates, tracking, and invoices
- **Homepage Editor** with drag-and-drop sections
- **Banner Management** with scheduling

### 🤖 AI Features
- Natural language product search
- Personalized product recommendations
- AI chat support

### 💳 Payments
- Razorpay integration (India)
- Stripe integration (Global)
- Cash on Delivery (COD)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Payment gateway accounts (Razorpay/Stripe)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd kibana

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migration in Supabase
# Copy contents of supabase/migrations/001_initial_schema.sql

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
kibana/
├── app/
│   ├── (store)/          # Storefront routes
│   ├── (admin)/          # Admin routes
│   └── api/              # API routes
├── components/
│   ├── ui/               # ShadCN UI components
│   ├── store/            # Storefront components
│   └── admin/            # Admin components
├── lib/                  # Utilities and helpers
├── types/                # TypeScript types
└── supabase/             # Database migrations
```

## 🔧 Configuration

### Environment Variables

See `SETUP_GUIDE.md` for detailed configuration instructions.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY` & `RAZORPAY_SECRET`
- `STRIPE_SECRET_KEY`
- `OPENAI_API_KEY` (optional)

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-launch checklist
- [Project Summary](./PROJECT_SUMMARY.md) - Feature overview

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **ShadCN UI** - Component library
- **Framer Motion** - Animations
- **GSAP** - Advanced animations

### Backend
- **Supabase** - Database, Auth, Storage
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication
- **Supabase Storage** - File storage

### Payments
- **Razorpay** - Indian payments
- **Stripe** - Global payments

### AI
- **OpenAI API** - AI features

## 📦 Key Dependencies

```json
{
  "next": "16.0.3",
  "react": "19.2.0",
  "@supabase/supabase-js": "^2.84.0",
  "framer-motion": "^12.23.24",
  "gsap": "^3.13.0",
  "razorpay": "^2.9.6",
  "stripe": "^20.0.0",
  "openai": "^6.9.1"
}
```

## 🎨 Features in Detail

### Storefront Pages
1. **Homepage** - Hero section, featured categories, products, testimonials
2. **Products** - Advanced filtering, sorting, search, pagination
3. **Product Detail** - Image gallery, reviews, variants, recommendations
4. **Cart** - Quantity management, save for later, coupons
5. **Checkout** - Multi-step process, address management, payments
6. **Wishlist** - Filtering, sharing, quick actions
7. **Search** - AI-powered natural language search
8. **Account** - Profile, orders, addresses

### Admin Features
1. **Dashboard** - Analytics, charts, recent activity
2. **Products** - Full CRUD, image upload, variants
3. **Categories** - Drag-and-drop ordering
4. **Orders** - Status management, tracking, invoices
5. **Homepage Editor** - Drag-and-drop sections
6. **Banners** - Scheduling and management

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Alternative: Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables
4. Deploy

See `DEPLOYMENT_CHECKLIST.md` for complete deployment guide.

## 📊 Statistics

- **106** TypeScript/TSX files
- **14** Major pages
- **50+** Reusable components
- **100%** Type-safe
- **Production-ready** code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Check Supabase dashboard
4. Review payment gateway dashboards

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Email marketing integration
- [ ] Mobile app
- [ ] Advanced AI features
- [ ] Social media integration

---

**Built with ❤️ for luxury fashion e-commerce**
