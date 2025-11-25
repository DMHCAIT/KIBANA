import { StoreHeader } from '@/components/store/StoreHeader'
import { StoreFooter } from '@/components/store/StoreFooter'
import { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'FAQ | KIBANA - Frequently Asked Questions',
  description: 'Find answers to common questions about KIBANA handbags, shipping, returns, and more',
}

export default function FAQPage() {
  const faqs = [
    {
      category: 'Orders & Shipping',
      items: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is also available at checkout. International orders may take 10-14 business days.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Please check our shipping page for more details.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you will receive a tracking number via email. You can use this to track your package in real-time.',
        },
        {
          question: 'What are your shipping costs?',
          answer: 'Shipping costs vary by location and shipping method. Free shipping is available on orders over ₹5,000. Standard shipping starts at ₹199.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      items: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy on all unused items in their original packaging. Items must be in new, unworn condition with all tags attached.',
        },
        {
          question: 'How do I return an item?',
          answer: 'To initiate a return, please contact our customer service team or use the return portal in your account. We will provide you with a return shipping label.',
        },
        {
          question: 'Can I exchange an item?',
          answer: 'Yes, you can exchange an item for a different size, color, or style. Exchanges are subject to availability. Please contact us for assistance.',
        },
        {
          question: 'How long do refunds take?',
          answer: 'Once we receive your returned item, refunds are processed within 5-7 business days. The refund will appear in your original payment method within 10-14 business days.',
        },
      ],
    },
    {
      category: 'Products',
      items: [
        {
          question: 'What materials are used in KIBANA handbags?',
          answer: 'We use premium materials including genuine leather, high-quality synthetic leather, and durable fabrics. Each product page lists the specific materials used.',
        },
        {
          question: 'How do I care for my handbag?',
          answer: 'Care instructions vary by material. Generally, we recommend storing your handbag in its dust bag when not in use, avoiding direct sunlight, and cleaning with a soft, damp cloth. Detailed care instructions are included with each purchase.',
        },
        {
          question: 'Are your handbags waterproof?',
          answer: 'Most of our handbags are water-resistant but not fully waterproof. We recommend avoiding exposure to heavy rain or water. Some styles may have additional water protection features.',
        },
        {
          question: 'Do you offer customization?',
          answer: 'Currently, we offer limited customization options. Please contact our customer service team to discuss customization possibilities for your order.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      items: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. We also offer EMI options for select orders.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete payment details on our servers.',
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Yes, we offer EMI (Easy Monthly Installments) through our payment partners for orders above ₹5,000. Options are available at checkout.',
        },
      ],
    },
    {
      category: 'Account & Support',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account during checkout or by clicking "Sign Up" in the header. Having an account allows you to track orders, save addresses, and manage your wishlist.',
        },
        {
          question: 'How can I contact customer service?',
          answer: 'You can reach us via email at support@kibana.com, phone at +1 (555) 123-4567, or through our contact form. Our team is available Monday-Friday, 9 AM - 6 PM.',
        },
        {
          question: 'Do you have a loyalty program?',
          answer: 'Yes! Our loyalty program rewards you with points for every purchase. Points can be redeemed for discounts on future orders. Sign up to start earning points.',
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <StoreHeader />
      <main className="flex-1">
        <div className="container px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our products, shipping, returns, and more
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our customer service team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}

