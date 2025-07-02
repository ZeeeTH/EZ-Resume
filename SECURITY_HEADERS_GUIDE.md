# Security Headers Implementation Guide for EZ-Resume

## Overview

This guide explains the security headers implemented in your Next.js application and how to test/troubleshoot them.

## 🔒 Security Headers Explained

### 1. Content Security Policy (CSP)
**Purpose**: Prevents XSS attacks by controlling which sources can load content

**Implementation**:
```javascript
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com; connect-src 'self' https://api.stripe.com https://api.openai.com https://*.supabase.co
```

**What it allows**:
- ✅ Scripts from your domain and Stripe
- ✅ API calls to OpenAI, Stripe, Supabase
- ✅ Google Analytics and Fonts
- ❌ Malicious scripts from unknown domains

### 2. X-Frame-Options
**Purpose**: Prevents clickjacking attacks

**Implementation**:
```javascript
X-Frame-Options: DENY
```

**What it does**:
- Prevents your site from being embedded in iframes
- Protects against clickjacking attacks

### 3. X-Content-Type-Options
**Purpose**: Prevents MIME type sniffing

**Implementation**:
```javascript
X-Content-Type-Options: nosniff
```

**What it does**:
- Forces browsers to respect declared content types
- Prevents malicious files from being executed

### 4. Strict-Transport-Security (HSTS)
**Purpose**: Forces HTTPS connections

**Implementation** (Production only):
```javascript
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**What it does**:
- Forces all connections to use HTTPS
- Prevents man-in-the-middle attacks
- Includes subdomains and preload list

### 5. X-XSS-Protection
**Purpose**: Enables browser XSS filtering

**Implementation**:
```javascript
X-XSS-Protection: 1; mode=block
```

**What it does**:
- Enables browser's built-in XSS protection
- Blocks pages when XSS is detected

### 6. Referrer-Policy
**Purpose**: Controls referrer information

**Implementation**:
```javascript
Referrer-Policy: origin-when-cross-origin
```

**What it does**:
- Sends full URL for same-origin requests
- Sends only origin for cross-origin requests
- Protects user privacy

### 7. Permissions-Policy
**Purpose**: Controls browser features

**Implementation**:
```javascript
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
```

**What it does**:
- Disables camera, microphone, geolocation for all origins
- Allows payment API only for your domain

## 🧪 Testing Your Security Headers

### 1. Automated Testing
Run the provided security test script:

```bash
# Test development
node scripts/test-security.js http://localhost:3000

# Test production
node scripts/test-security.js https://ez-resume.xyz
```

### 2. Browser Testing
1. Open Chrome DevTools (F12)
2. Go to Security tab
3. Verify HTTPS certificate and security state
4. Check Console for CSP violations

### 3. Online Testing Tools
- [Security Headers Scanner](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## 🚨 Common Issues and Solutions

### Issue 1: CSP Blocking Inline Scripts
**Symptoms**: Console errors like "Refused to execute inline script"

**Solutions**:
```javascript
// Option 1: Add nonce for specific scripts
<script nonce={nonce}>...</script>

// Option 2: Move to external file
// Instead of inline: <script>doSomething()</script>
// Use: <script src="/js/script.js"></script>

// Option 3: Use event listeners
// Instead of: <button onclick="doSomething()">
// Use: button.addEventListener('click', doSomething)
```

### Issue 2: CSP Blocking External Resources
**Symptoms**: Resources not loading, console CSP violations

**Solution**: Add domains to CSP whitelist in `lib/security-config.ts`:
```javascript
connectSrc: [
  "'self'",
  "https://api.newservice.com", // Add new API
  // ... existing domains
]
```

### Issue 3: Stripe Payment Issues
**Symptoms**: Payment modal not loading

**Verification**: Check these domains are whitelisted:
- `https://js.stripe.com` (scripts and frames)
- `https://api.stripe.com` (API calls)
- `https://hooks.stripe.com` (webhooks)

### Issue 4: HSTS Issues in Development
**Symptoms**: Local development forcing HTTPS

**Solution**: HSTS is disabled in development:
```javascript
// Only applies in production
...(process.env.NODE_ENV === 'production' ? [{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload'
}] : [])
```

### Issue 5: Google Analytics Not Working
**Symptoms**: Analytics not tracking

**Verification**: Check these domains are whitelisted:
- `https://www.googletagmanager.com` (scripts)
- `https://www.google-analytics.com` (scripts and images)

## 🔧 Environment-Specific Configuration

### Development Environment
```javascript
// More relaxed CSP for development
script-src 'self' 'unsafe-eval' 'unsafe-inline' localhost:*

// No HSTS in development
// Strict-Transport-Security header not set
```

### Production Environment
```javascript
// Stricter CSP
script-src 'self' 'unsafe-eval' https://js.stripe.com

// HSTS enabled
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

// Upgrade insecure requests
upgrade-insecure-requests
```

## 📊 Security Headers Checklist

Before deploying to production, verify:

- [ ] All security headers are present and correct
- [ ] CSP allows all necessary resources
- [ ] Stripe integration works correctly
- [ ] Google Analytics tracks properly
- [ ] No console CSP violations
- [ ] External API calls succeed
- [ ] HTTPS redirect works in production
- [ ] Security scanner shows A+ rating

## 🚀 Deployment Considerations

### Vercel Deployment
Headers are handled by Next.js configuration - no additional setup needed.

### Custom Server Deployment
Ensure your reverse proxy (nginx, Apache) doesn't override security headers:

```nginx
# nginx - let Next.js handle security headers
location / {
    proxy_pass http://localhost:3000;
    # Don't add conflicting headers here
}
```

### CDN Configuration
If using a CDN, ensure it doesn't strip security headers:
- CloudFlare: Headers pass through automatically
- AWS CloudFront: May need explicit configuration

## 🔍 Monitoring and Maintenance

### CSP Violation Reporting
Add CSP reporting to catch violations:

```javascript
Content-Security-Policy: ...; report-uri /api/csp-report
```

### Regular Security Audits
- Run security tests after each deployment
- Use automated security scanning tools
- Monitor for new security headers and best practices
- Update CSP when adding new third-party services

### Incident Response
If security headers cause issues in production:

1. **Immediate**: Disable problematic header via feature flag
2. **Short-term**: Fix configuration and test thoroughly
3. **Long-term**: Implement monitoring to prevent recurrence

## 🎯 Security Score Targets

Aim for these security ratings:
- **SecurityHeaders.com**: A+ (all headers present and configured correctly)
- **Mozilla Observatory**: A+ (90+ score)
- **CSP Evaluator**: No high-risk issues

## 📚 Additional Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Next.js Security Headers Guide](https://nextjs.org/docs/advanced-features/security-headers)

## 🆘 Emergency Procedures

If security headers break your production site:

### 1. Quick Disable (Emergency)
Comment out the problematic header in `next.config.js`:

```javascript
// Temporarily disable if causing issues
// {
//   key: 'Content-Security-Policy',
//   value: generateCSP()
// }
```

### 2. Gradual Rollback
Use environment variables to control header strictness:

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
const useStrictCSP = process.env.STRICT_CSP === 'true';

// Apply based on flags
```

### 3. Monitoring Setup
Implement header monitoring to catch issues early:

```javascript
// Add to your monitoring service
if (response.headers['content-security-policy']) {
  // Log successful header application
} else {
  // Alert: Security headers missing
}
```

Remember: Security headers are crucial for protecting your users and your business. Take time to implement them correctly rather than disabling them entirely. 