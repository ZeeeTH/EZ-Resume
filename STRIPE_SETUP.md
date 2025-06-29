# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your EZ Resume application.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Your application deployed or running locally

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# Base URL for webhooks (production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Stripe Dashboard Setup

### 1. Get Your API Keys

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
4. Replace the placeholder values in your `.env.local` file

### 2. Set Up Webhooks

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL:
   - **Development**: `http://localhost:3000/api/webhook/stripe`
   - **Production**: `https://your-domain.com/api/webhook/stripe`
4. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 3. Test Mode vs Live Mode

- **Test Mode**: Use test keys (start with `sk_test_` and `pk_test_`)
- **Live Mode**: Use live keys (start with `sk_live_` and `pk_live_`)

For development, use test mode. For production, switch to live mode.

## Testing the Integration

### Test Card Numbers

Use these test card numbers in Stripe test mode:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

### Test the Flow

1. Start your development server: `npm run dev`
2. Navigate to your application
3. Select a pricing plan
4. Fill out the resume form
5. Use a test card number to complete payment
6. Check that documents are generated and emailed

## Production Deployment

### 1. Update Environment Variables

When deploying to production:

1. Switch to live Stripe keys
2. Update `NEXT_PUBLIC_BASE_URL` to your production domain
3. Update webhook endpoint URL in Stripe Dashboard

### 2. Webhook Endpoint

Ensure your webhook endpoint is accessible at:
```
https://your-domain.com/api/webhook/stripe
```

### 3. SSL Certificate

Stripe requires HTTPS in production. Ensure your domain has a valid SSL certificate.

## Pricing Configuration

The current pricing is configured in `lib/stripe.ts`:

```typescript
export const PRICING = {
  RESUME_ONLY: 1999, // $19.99 in cents
  COVER_LETTER_ONLY: 1499, // $14.99 in cents
  BOTH: 2999, // $29.99 in cents
}
```

To change pricing, update these values and restart your application.

## Troubleshooting

### Common Issues

1. **"Payment service not configured"**
   - Check that `STRIPE_SECRET_KEY` is set in your environment variables

2. **"Invalid webhook signature"**
   - Verify your `STRIPE_WEBHOOK_SECRET` matches the signing secret in Stripe Dashboard

3. **Payment fails with test cards**
   - Ensure you're using test mode keys with test card numbers
   - Check Stripe Dashboard for detailed error logs

4. **Documents not generated after payment**
   - Check webhook endpoint is accessible
   - Verify webhook events are properly configured
   - Check server logs for errors

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```bash
DEBUG=stripe:*
```

## Security Considerations

1. **Never expose secret keys** in client-side code
2. **Always verify webhook signatures** (already implemented)
3. **Use HTTPS in production**
4. **Validate all input data** (already implemented with Zod)
5. **Store sensitive data securely** (form data is stored in Stripe metadata)

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application-specific issues:
- Check the application logs
- Review the webhook configuration
- Verify environment variables are set correctly 