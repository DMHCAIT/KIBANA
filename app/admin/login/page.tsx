import { redirect } from 'next/navigation'

export default function AdminLoginPage() {
  // Immediately redirect to admin dashboard - login not required
  redirect('/admin')
}

