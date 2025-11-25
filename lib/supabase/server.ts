import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Check if Supabase environment variables are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that will fail gracefully
    // This allows the app to run without Supabase configured
    const createChainableQuery = (options: any = {}) => {
      const result = { data: null, error: { message: 'Supabase not configured' }, count: 0 }
      const chain: any = {
        select: (cols?: string, opts?: any) => {
          if (opts?.count === 'exact' && opts?.head) {
            return Promise.resolve({ count: 0, error: null })
          }
          return createChainableQuery({ ...options, select: cols })
        },
        insert: () => createChainableQuery({ ...options, insert: true }),
        update: () => createChainableQuery({ ...options, update: true }),
        delete: () => createChainableQuery({ ...options, delete: true }),
        eq: (col: string, val: any) => createChainableQuery({ ...options, eq: { col, val } }),
        neq: (col: string, val: any) => createChainableQuery({ ...options, neq: { col, val } }),
        gte: (col: string, val: any) => createChainableQuery({ ...options, gte: { col, val } }),
        lte: (col: string, val: any) => createChainableQuery({ ...options, lte: { col, val } }),
        in: (col: string, vals: any[]) => createChainableQuery({ ...options, in: { col, vals } }),
        or: (query: string) => createChainableQuery({ ...options, or: query }),
        not: (col: string, op: string, val: any) => createChainableQuery({ ...options, not: { col, op, val } }),
        order: (col: string, opts?: any) => createChainableQuery({ ...options, order: { col, opts } }),
        limit: (num: number) => createChainableQuery({ ...options, limit: num }),
        range: (from: number, to: number) => createChainableQuery({ ...options, range: { from, to } }),
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        then: (onResolve: any) => Promise.resolve(result).then(onResolve),
        catch: (onReject: any) => Promise.resolve(result).catch(onReject),
      }
      // Make it thenable
      chain.then = (onResolve: any) => Promise.resolve(result).then(onResolve)
      chain.catch = (onReject: any) => Promise.resolve(result).catch(onReject)
      return chain
    }

    return {
      from: (table: string) => createChainableQuery({ table }),
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
    const createChainableQuery = (): any => {
      const result = { data: [], error: null, count: 0 }
      const chain: any = {
        select: (cols?: string, opts?: any) => {
          if (opts?.count === 'exact' && opts?.head) {
            return Promise.resolve({ count: 0, error: null })
          }
          return createChainableQuery()
        },
        insert: () => createChainableQuery(),
        update: () => createChainableQuery(),
        delete: () => createChainableQuery(),
        eq: () => createChainableQuery(),
        neq: () => createChainableQuery(),
        gte: () => createChainableQuery(),
        lte: () => createChainableQuery(),
        in: () => createChainableQuery(),
        or: () => createChainableQuery(),
        not: () => createChainableQuery(),
        order: () => createChainableQuery(),
        limit: () => createChainableQuery(),
        range: () => createChainableQuery(),
        single: () => Promise.resolve({ data: null, error: { message: 'Cookies not available' } }),
      }
      chain.then = (onResolve: any) => Promise.resolve(result).then(onResolve)
      chain.catch = (onReject: any) => Promise.resolve(result).catch(onReject)
      return chain
    }
    return {
      from: () => createChainableQuery(),
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

