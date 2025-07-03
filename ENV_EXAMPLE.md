# EZ-RESUME MVP ENVIRONMENT VARIABLES

Copy this to `.env.local` and fill in your actual values:

```bash
# =============================================================================
# STRIPE CONFIGURATION (REQUIRED)
# =============================================================================
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# =============================================================================
# SUPABASE CONFIGURATION (REQUIRED)
# =============================================================================
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# =============================================================================
# OPENAI CONFIGURATION (REQUIRED)
# =============================================================================
# Get this from OpenAI: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_api_key_here

# =============================================================================
# EMAIL CONFIGURATION (REQUIRED)
# =============================================================================
# Gmail app password for sending welcome emails
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password_here

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
# Base URL for your application (production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# =============================================================================
# GOOGLE ANALYTICS (OPTIONAL)
# =============================================================================
# Get this from Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=your_google_site_verification_code

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
# Set to 'development' for local development
NODE_ENV=development

# =============================================================================
# SECURITY SETTINGS (OPTIONAL)
# =============================================================================
# Enable strict CSP in production
STRICT_CSP=true
```

## DEPLOYMENT CHECKLIST

1. **Stripe Setup:**
   - Create Stripe account and get API keys
   - Set up webhook endpoint: `https://your-domain.com/api/webhook/stripe`
   - Configure webhook events: `checkout.session.completed`

2. **Supabase Setup:**
   - Create Supabase project
   - Set up database tables (profiles, resumes, cover_letters)
   - Configure authentication

3. **OpenAI Setup:**
   - Create OpenAI account and get API key
   - Set up billing for API usage

4. **Email Setup:**
   - Configure Gmail app password
   - Test email functionality

5. **Production Deployment:**
   - Change all 'test' keys to 'live' keys
   - Update domain URLs
   - Set NODE_ENV=production
   - Configure SSL certificate 