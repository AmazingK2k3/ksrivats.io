import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, name, email, message, postSlug, postType, honeypot } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Route based on submission type
    if (type === 'comment') {
      // Handle comment submission
      return await handleCommentSubmission(req, res, { name, email, message, postSlug, postType, honeypot });
    } else {
      // Handle contact form submission (default)
      return await handleContactSubmission(req, res, { name, email, message });
    }
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500).json({ message: 'Failed to process submission' });
  }
}

async function handleContactSubmission(
  req: VercelRequest,
  res: VercelResponse,
  { name, email, message }: { name: string; email: string; message: string }
) {
  // Email sending logic (only if credentials are provided)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself
      subject: `Contact Form: ${name}`,
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
  }

  // Log the submission (for debugging)
  console.log('Contact form submission:', { name, email, message: message.substring(0, 100) });

  res.json({ message: 'Message sent successfully' });
}

async function handleCommentSubmission(
  req: VercelRequest,
  res: VercelResponse,
  { name, email, message, postSlug, postType, honeypot }: {
    name: string;
    email: string;
    message: string;
    postSlug?: string;
    postType?: string;
    honeypot?: string;
  }
) {
  // Honeypot check - silently reject bots
  if (honeypot) {
    return res.json({ message: 'Comment submitted successfully' });
  }

  // Validate comment-specific fields
  if (!postSlug || !postType) {
    return res.status(400).json({ message: 'Post information is required' });
  }

  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  console.log('[DEBUG] Supabase config:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlSource: process.env.SUPABASE_URL ? 'SUPABASE_URL' : 'VITE_SUPABASE_URL',
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not configured');
    return res.status(500).json({ message: 'Comments are not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Insert comment into Supabase
  const commentData = {
    post_slug: postSlug,
    post_type: postType,
    author_name: name.trim(),
    author_email: email.trim(),
    content: message.trim(),
    status: 'approved',
    website: '',
  };

  console.log('[DEBUG] Attempting to insert comment:', commentData);

  const { data: insertData, error: insertError } = await supabase.from('comments').insert(commentData).select();

  console.log('[DEBUG] Insert result:', { data: insertData, error: insertError });

  if (insertError) {
    console.error('Error inserting comment:', insertError);
    return res.status(500).json({ message: 'Failed to submit comment' });
  }

  // Send email notification
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself
      subject: `New Comment on ${postType}: ${postSlug}`,
      text: `
New comment on your ${postType}!

Post: ${postSlug}
Name: ${name}
Email: ${email}

Comment:
${message}
      `,
      html: `
<h3>New Comment on Your ${postType === 'post' ? 'Blog Post' : 'Project'}!</h3>
<p><strong>Post:</strong> ${postSlug}</p>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Comment:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
<br>
<p><em>View your site to respond or moderate.</em></p>
      `,
    });
  }

  // Log the comment (for debugging)
  console.log('Comment submitted:', { name, email, postSlug, postType });

  res.json({ message: 'Comment submitted successfully' });
}
