import { Database } from './database'

export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row']
  variants?: ProductVariant[]
  images?: ProductImage[]
}

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type CartItem = Database['public']['Tables']['cart']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist']['Row']
export type Banner = Database['public']['Tables']['banners']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

