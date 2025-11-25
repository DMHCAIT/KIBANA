# Admin Credentials Setup Guide

## How to Create Admin User

The KIBANA admin panel requires a user account with the `role` set to `'admin'` in the `users` table.

### Option 1: Using Supabase Dashboard (Recommended)

1. **Create a User Account:**
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** > **Users**
   - Click **Add User** or **Invite User**
   - Enter an email and password
   - Create the user

2. **Set Admin Role:**
   - Go to **Table Editor** > **users** table
   - Find the user you just created (or use an existing user)
   - Edit the `role` field and set it to `'admin'`
   - Save the changes

### Option 2: Using SQL Query

Run this SQL query in your Supabase SQL Editor:

```sql
-- First, create a user in Supabase Auth (if not exists)
-- Then update their role in the users table

-- If the users table doesn't have the user yet, insert it:
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_FROM_AUTH',  -- Get this from Authentication > Users
  'admin@kibana.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Or update existing user:
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Option 3: Temporary Bypass (Development Only)

For development/testing, you can temporarily modify the admin layout to bypass the role check. **⚠️ Never do this in production!**

Edit `app/admin/layout.tsx` and comment out the role check:

```typescript
// Temporarily allow all authenticated users (DEV ONLY)
// if (userData && userData.role !== 'admin') {
//   redirect('/')
// }
```

## Default Test Credentials

If you want to set up a test admin account:

1. **Email:** `admin@kibana.com`
2. **Password:** (set your own secure password)
3. **Role:** `admin`

## Steps to Set Up:

1. **Sign up/Login** at `/admin/login` with any email/password
2. **Go to Supabase Dashboard** → Table Editor → `users` table
3. **Find your user** by email
4. **Set `role` field** to `'admin'`
5. **Logout and login again** at `/admin/login`

## Verify Admin Access

After setting up:
- Visit `/admin/login`
- Login with your admin credentials
- You should be redirected to `/admin` dashboard
- You should see the admin sidebar with all admin pages

## Security Notes

- Always use strong passwords for admin accounts
- Never commit admin credentials to version control
- In production, use environment variables for sensitive data
- Consider implementing 2FA for admin accounts
- Regularly audit admin user access

