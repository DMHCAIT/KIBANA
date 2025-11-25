import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
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
        signInWithOAuth: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

