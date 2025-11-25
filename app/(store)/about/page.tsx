import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Heart, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | KIBANA - Luxury Handbags',
  description: 'Learn about KIBANA, our mission, values, and commitment to crafting luxury handbags for the modern woman',
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-black text-white rounded-full shadow-sm">
                <span className="text-sm font-bold uppercase tracking-wider">About Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900">
                About KIBANA
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Crafting luxury handbags for the modern woman who values elegance, quality, and timeless style.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  Founded with a vision to redefine luxury handbags, KIBANA has been at the forefront of 
                  creating elegant, functional, and sophisticated accessories for women worldwide. Our journey 
                  began with a simple belief: every woman deserves to carry a piece of art.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We source the finest materials from around the globe, working with skilled artisans who 
                  share our passion for excellence. Each handbag is meticulously crafted, ensuring that 
                  every detail meets our exacting standards of quality and design.
                </p>
                <p className="text-lg text-muted-foreground">
                  Today, KIBANA stands as a symbol of luxury, elegance, and empowerment. We continue to 
                  innovate while staying true to our core values of quality, craftsmanship, and customer 
                  satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Quality</h3>
                  <p className="text-muted-foreground">
                    We never compromise on quality. Every product is crafted with premium materials and attention to detail.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Passion</h3>
                  <p className="text-muted-foreground">
                    Our passion for design and craftsmanship drives us to create exceptional products that inspire.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                  <p className="text-muted-foreground">
                    Your satisfaction is our priority. We&apos;re committed to providing exceptional service and support.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously innovate to bring you the latest trends while maintaining timeless elegance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">Our Mission</h2>
              <p className="text-xl text-muted-foreground text-center leading-relaxed">
                To empower women through elegant, high-quality handbags that reflect their unique style and 
                personality. We believe that the right handbag is more than an accessory—it&apos;s a statement of 
                confidence, sophistication, and individuality.
              </p>
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  )
}

