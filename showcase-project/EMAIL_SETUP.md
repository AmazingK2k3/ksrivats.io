# Email Setup Guide for Portfolio Contact Form

## Overview
This guide will help you set up email functionality for your portfolio contact form. The system includes security features like rate limiting, spam detection, and input sanitization.

## Prerequisites
- Gmail account (recommended) or another SMTP email provider
- Environment variables configured

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to Security
2. Select "2-Step Verification"
3. Scroll down to "App passwords"
4. Select "Mail" and your device
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Create a `.env` file in your project root with:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password

# Application Configuration
NODE_ENV=development
PORT=5000
```

## Alternative SMTP Providers

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

### AWS SES
```bash
SMTP_HOST=email-smtp.your-region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## Security Features

### Rate Limiting
- Maximum 5 contact form submissions per IP address every 15 minutes
- Automatically cleans up old rate limit records
- Returns remaining requests count to client

### Spam Detection
- Filters common spam keywords
- Blocks suspicious URLs (except social media)
- Validates email format and content length

### Input Sanitization
- Removes HTML tags and potentially dangerous content
- Limits message length to 2000 characters
- Escapes HTML in email content

## Testing the Setup

### 1. Check Email Service Status
The application will log whether email service is initialized:
```
Email service initialized successfully
```
or
```
Email service not initialized - missing credentials
```

### 2. Test Contact Form
1. Fill out the contact form on your website
2. Check the browser console for any errors
3. Verify you receive an email notification
4. Check the application logs for confirmation

### 3. Test Rate Limiting
Try submitting the contact form more than 5 times within 15 minutes to verify rate limiting works.

## Troubleshooting

### Common Issues

#### "Email service not initialized"
- Check that SMTP_USER and SMTP_PASS are set correctly
- Verify your app password is 16 characters (no spaces)
- Ensure 2FA is enabled on your Gmail account

#### "Failed to send email"
- Check your internet connection
- Verify SMTP credentials are correct
- Check Gmail "Less secure app access" is disabled (use app passwords instead)
- Review firewall settings for outbound port 587

#### Rate limiting not working
- Check that you're testing from the same IP address
- Verify the server is properly logging rate limit attempts
- Clear the rate limit store if testing: restart the server

### Debug Mode
Add this to your environment variables for detailed logging:
```bash
DEBUG=nodemailer:*
```

## Production Considerations

### Security
- Always use environment variables for credentials
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)
- Implement additional spam detection if needed
- Monitor for abuse and adjust rate limits accordingly

### Scalability
- For high-traffic sites, replace in-memory rate limiting with Redis
- Consider using a queue system for email sending
- Implement database logging for all contact form submissions

### Monitoring
- Set up alerts for failed email deliveries
- Monitor rate limit violations
- Track spam detection accuracy

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| SMTP_HOST | Yes | SMTP server hostname | smtp.gmail.com |
| SMTP_PORT | Yes | SMTP server port | 587 |
| SMTP_USER | Yes | SMTP username/email | your-email@gmail.com |
| SMTP_PASS | Yes | SMTP password/app password | abcdefghijklmnop |
| NODE_ENV | No | Environment mode | development |
| PORT | No | Server port | 5000 |

## Support
If you encounter issues, check:
1. Application logs for detailed error messages
2. Email provider documentation
3. Network connectivity and firewall settings
4. Environment variable configuration
