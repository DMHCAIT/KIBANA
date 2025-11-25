import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that will fail gracefully
    // This allows the app to run without Supabase configured
    const createChainableQuery = () => {
      const chain = {
        select: () => chain,
        insert: () => chain,
        update: () => chain,
        delete: () => chain,
        eq: () => chain,
        neq: () => chain,
        gte: () => chain,
        lte: () => chain,
        in: () => chain,
        or: () => chain,
        order: () => chain,
        limit: () => chain,
        range: () => chain,
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        then: (onResolve: any) => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }).then(onResolve),
        catch: (onReject: any) => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }).catch(onReject),
      }
      return chain
    }

    return {
      from: () => createChainableQuery(),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  let cookieStore
  try {
    cookieStore = await cookies()
  } catch (error) {
    console.warn('Failed to get cookies:', error)
    // Return mock client if cookies fail
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null, count: 0 }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Cookies not available' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Cookies not available' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Cookies not available' } }),
        eq: () => Promise.resolve({ data: [], error: null, count: 0 }),
        order: () => Promise.resolve({ data: [], error: null, count: 0 }),
        limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
        range: () => Promise.resolve({ data: [], error: null, count: 0 }),
        single: () => Promise.resolve({ data: null, error: { message: 'Cookies not available' } }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    } as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

