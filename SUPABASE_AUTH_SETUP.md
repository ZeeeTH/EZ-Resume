# Supabase Authentication Setup Guide

This guide will help you set up the Supabase database schema and environment variables needed for the authentication system.

## Prerequisites

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your project URL and keys from the project settings

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side Supabase (existing)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Schema Setup

### 1. Create the Profiles Table

Go to your Supabase dashboard → SQL Editor and run this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'paid')),
  selected_industry text,
  ai_usage jsonb DEFAULT '{"bulletPoints": 0, "summary": 0, "skills": 0}'::jsonb,
  usage_reset_date date DEFAULT CURRENT_DATE,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### 3. Create Profile Auto-Creation Function

```sql
-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Authentication Configuration

### 1. Enable Email Authentication

In your Supabase dashboard:
1. Go to Authentication → Settings
2. Enable "Email" provider
3. Configure email templates if desired
4. Set up SMTP (optional, uses Supabase's SMTP by default)

### 2. Configure Email Templates (Optional)

You can customize the email templates in Authentication → Templates:
- Confirm signup
- Magic link
- Change email address
- Reset password

## Testing the Setup

### 1. Test User Registration

```javascript
// Test in browser console
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
})
console.log('Signup result:', { data, error })
```

### 2. Check Profile Creation

```sql
-- Check if profiles are being created
SELECT * FROM profiles;
```

### 3. Test Authentication Flow

1. Try signing up with a new email
2. Check your email for verification
3. Sign in after verification
4. Check that profile was created automatically

## Features Enabled

✅ **User Registration & Login**
- Email/password authentication
- Automatic profile creation
- Email verification

✅ **AI Usage Tracking**
- Track usage per content type
- Enforce free tier limits
- Reset usage tracking

✅ **User Profiles**
- Store user preferences
- Track subscription tier
- Save industry selection

✅ **Row Level Security**
- Users can only access their own data
- Secure database policies

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Restart your development server after adding variables
   - Check that variables start with `NEXT_PUBLIC_` for client-side access

2. **RLS Policies Too Restrictive**
   - Test policies in Supabase SQL editor
   - Use `auth.uid()` to check current user

3. **Profile Not Created on Signup**
   - Check if the trigger function is created
   - Verify the trigger is attached to `auth.users`

4. **CORS Issues**
   - Check your Supabase project URL is correct
   - Ensure you're using the correct anon key

### Debug Queries

```sql
-- Check if user profiles exist
SELECT COUNT(*) FROM profiles;

-- Check recent signups
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check profile trigger
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

## Security Notes

- Never expose your service role key on the client side
- Use environment variables for all sensitive data
- RLS policies protect user data automatically
- Consider implementing rate limiting for production

## Next Steps

After completing this setup:
1. Test the authentication flow in your app
2. Verify AI usage limits work correctly
3. Test the upgrade flow (when you implement payments)
4. Monitor usage in Supabase dashboard

Your authentication system is now ready to support the freemium AI features! 