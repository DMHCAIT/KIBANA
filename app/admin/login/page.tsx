'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard - login not required
    router.push('/admin')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Redirecting to Admin...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Login is not required. Redirecting to admin dashboard...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

