import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homepage Editor | KIBANA Admin',
  description: 'Customize your homepage layout and sections',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: '/admin/homepage',
  },
}

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

