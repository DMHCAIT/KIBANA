import { ReactNode } from 'react'

// Separate layout for login page that doesn't require authentication
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

