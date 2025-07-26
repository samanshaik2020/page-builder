# Email System Configuration Guide

## Overview
This document outlines the email system configuration for SquPage using Supabase Auth with Resend SMTP integration.

## Current Setup

### Domain Configuration
- **Domain**: squpage.com (verified in Resend)
- **SMTP Provider**: Resend
- **Integration**: Supabase Auth SMTP

### Required DNS Records (Already configured)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT  
Name: resend._domainkey
Value: [Your DKIM key from Resend dashboard]

Type: MX
Name: @
Value: feedback-smtp.resend.com (Priority: 10)
```

## Supabase Configuration

### SMTP Settings (Dashboard → Auth → Settings)
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your Resend API Key]
Enable SMTP: ✓
```

### Email Templates Configuration
Go to Dashboard → Auth → Email Templates and configure:

#### Invite User Template
```
From: noreply@squpage.com
Subject: You've been invited to join SquPage
```

#### Confirm Signup Template  
```
From: noreply@squpage.com
Subject: Confirm your SquPage account
```

#### Magic Link Template
```
From: noreply@squpage.com
Subject: Your SquPage login link
```

#### Reset Password Template
```
From: noreply@squpage.com
Subject: Reset your SquPage password
```

## Troubleshooting Common Issues

### 1. "Failed to invite user" Error
**Symptoms**: Error sending invite email from Supabase
**Solutions**:
- Verify SMTP credentials in Supabase dashboard
- Check that "From" email uses verified domain
- Ensure Resend API key has send permissions
- Check Supabase Auth logs for detailed error messages

### 2. Domain Not Verified
**Symptoms**: Emails not sending or bouncing
**Solutions**:
- Verify domain status in Resend dashboard
- Check DNS propagation (can take up to 48 hours)
- Use DNS checker tools to verify records

### 3. Rate Limiting
**Symptoms**: Some emails send, others don't
**Solutions**:
- Check Resend rate limits for your plan
- Implement retry logic for failed sends
- Consider upgrading Resend plan if needed

## Testing Email Functionality

### 1. Test SMTP Connection
```bash
# Use a tool like telnet or swaks to test SMTP
telnet smtp.resend.com 587
```

### 2. Test Supabase Auth Emails
- Try user signup from your app
- Check Supabase Auth logs
- Monitor Resend dashboard for delivery status

### 3. Check Email Delivery
- Test with different email providers (Gmail, Outlook, etc.)
- Check spam folders
- Verify email content renders correctly

## Environment Variables

Ensure these are set in your deployment:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Monitoring and Logs

### Supabase Auth Logs
- Dashboard → Auth → Logs
- Look for SMTP-related errors
- Check invite/signup attempt logs

### Resend Dashboard
- Monitor email delivery status
- Check bounce/complaint rates
- Review sending statistics

## Common Error Messages and Solutions

### "Error sending invite email"
1. Check SMTP configuration in Supabase
2. Verify domain authentication in Resend
3. Ensure API key permissions
4. Check email template "From" address

### "Failed to make POST request"
1. Network connectivity issues
2. Incorrect Supabase URL/keys
3. Rate limiting
4. SMTP server issues

## Next Steps for Debugging

1. **Check Supabase Auth Logs**: 
   - Go to your Supabase dashboard
   - Navigate to Auth → Logs
   - Look for recent invite attempts and error details

2. **Verify Resend Configuration**:
   - Login to Resend dashboard
   - Check domain verification status
   - Verify API key permissions
   - Check recent sending activity

3. **Test with Simple Email**:
   - Try sending a test email directly through Resend API
   - Use their API to verify configuration works

4. **Check Network/Firewall**:
   - Ensure SMTP ports (587/465) are not blocked
   - Test from different networks if possible

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Resend SMTP Documentation](https://resend.com/docs/send-with-smtp)
- [Email Deliverability Best Practices](https://resend.com/docs/dashboard/deliverability)
