import { Request } from 'express';

// Simple in-memory rate limiter (for production, use Redis or similar)
interface RateLimitStore {
  [ip: string]: {
    requests: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 contact form submissions per 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remainingRequests?: number; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore[ip];

  // Clean up old records
  if (record && now > record.resetTime) {
    delete rateLimitStore[ip];
  }

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = {
      requests: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    return { allowed: true, remainingRequests: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: rateLimitStore[ip].resetTime };
  }

  const currentRecord = rateLimitStore[ip];
  
  if (currentRecord.requests >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: currentRecord.resetTime };
  }

  currentRecord.requests++;
  return { 
    allowed: true, 
    remainingRequests: RATE_LIMIT_MAX_REQUESTS - currentRecord.requests,
    resetTime: currentRecord.resetTime 
  };
}

// Get client IP address
export function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.ip;
  return ip || req.socket.remoteAddress || 'unknown';
}

// Sanitize input to prevent XSS and injection attacks
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 2000); // Limit length
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate and sanitize contact form data
export function validateContactData(data: any): { isValid: boolean; errors: string[]; sanitizedData?: any } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }

  const { name, email, message } = data;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // Validate email
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(email.trim())) {
    errors.push('Invalid email address');
  }

  // Validate message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push('Message is required');
  } else if (message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  } else if (message.trim().length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Sanitize the data
  const sanitizedData = {
    name: sanitizeInput(name),
    email: email.trim().toLowerCase(),
    message: sanitizeInput(message),
  };

  return { isValid: true, errors: [], sanitizedData };
}

// Check for spam patterns
export function detectSpam(data: { name: string; email: string; message: string }): boolean {
  const spamPatterns = [
    /\b(?:viagra|cialis|loan|casino|betting|crypto|bitcoin)\b/i,
    /\b(?:click here|buy now|free money|make money fast)\b/i,
    /\b(?:seo|backlinks|website promotion)\b/i,
    /http[s]?:\/\/(?![\w.-]*(?:github|linkedin|behance|instagram|twitter)\.com)/i, // URLs except social media
  ];

  const text = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  
  return spamPatterns.some(pattern => pattern.test(text));
}

// Clean up old rate limit records (call this periodically)
export function cleanupRateLimit() {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(ip => {
    if (rateLimitStore[ip].resetTime < now) {
      delete rateLimitStore[ip];
    }
  });
}

// Run cleanup every hour
setInterval(cleanupRateLimit, 60 * 60 * 1000);
