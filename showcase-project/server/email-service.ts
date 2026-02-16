import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailData {
  name: string;
  email: string;
  message: string;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '\n': '<br>',
  };
  return text.replace(/[&<>"'\n]/g, (m) => map[m]);
}

class EmailService {
  private transporter: Transporter | null = null;
  private initialized = false;

  async initialize() {
    try {
      // For development, we'll use a simple configuration
      // In production, you should use environment variables for credentials
      const config: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || '', // Your email
          pass: process.env.SMTP_PASS || '', // Your app password
        },
      };

      // Only initialize if we have credentials
      if (config.auth.user && config.auth.pass) {
        this.transporter = nodemailer.createTransport(config);
        
        // Verify connection
        await this.transporter.verify();
        this.initialized = true;
        console.log('Email service initialized successfully');
      } else {
        console.log('Email service not initialized - missing credentials');
        console.log('Set SMTP_USER and SMTP_PASS environment variables to enable email functionality');
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.initialized = false;
    }
  }

  async sendContactEmail(data: EmailData): Promise<boolean> {
    if (!this.initialized || !this.transporter) {
      console.log('Email service not available - storing message locally only');
      return false;
    }

    try {
      // Escape HTML to prevent injection
      const escapedName = escapeHtml(data.name);
      const escapedEmail = escapeHtml(data.email);
      const escapedMessage = escapeHtml(data.message);

      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@portfolio.com',
        to: 'kaushiksrivatsan03@gmail.com', // Your email where you want to receive messages
        subject: `New Contact Form Message from ${data.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Portfolio Website</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Contact Information</h2>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #475569; font-size: 14px;">Name:</strong>
                  <div style="color: #1e293b; font-size: 16px; margin-top: 5px;">${escapedName}</div>
                </div>
                <div>
                  <strong style="color: #475569; font-size: 14px;">Email:</strong>
                  <div style="margin-top: 5px;">
                    <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none; font-size: 16px;">${escapedEmail}</a>
                  </div>
                </div>
              </div>
              
              <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 25px;">
                <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Message</h2>
                <div style="color: #475569; line-height: 1.6; font-size: 15px; white-space: pre-line;">${escapedMessage}</div>
              </div>
              
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 12px; text-align: center;">
                <h3 style="color: white; margin: 0 0 10px 0; font-size: 16px;">Quick Actions</h3>
                <div style="margin-bottom: 15px;">
                  <a href="mailto:${data.email}" style="display: inline-block; background-color: rgba(255,255,255,0.2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 5px;">
                    Reply via Email
                  </a>
                </div>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px;">
                  Response time goal: Within 24 hours
                </p>
              </div>
            </div>
            
            <footer style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                This email was automatically generated from your portfolio contact form.
              </p>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
                Timestamp: ${new Date().toLocaleString('en-US', { 
                  timeZone: 'UTC',
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} UTC
              </p>
            </footer>
          </div>
        `,
        replyTo: data.email,
        // Add some security headers
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'X-Mailer': 'Portfolio Contact Form',
        },
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Contact email sent successfully from ${data.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send contact email:', error);
      return false;
    }
  }

  async sendCommentNotification(data: {
    postSlug: string;
    postType: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }): Promise<boolean> {
    if (!this.initialized || !this.transporter) {
      console.log('Email service not available - skipping comment notification');
      return false;
    }

    try {
      const escapedName = escapeHtml(data.authorName);
      const escapedEmail = escapeHtml(data.authorEmail);
      const escapedContent = escapeHtml(data.content);
      const postTypeLabel = data.postType === 'post' ? 'Blog Post' : 'Project';

      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@portfolio.com',
        to: 'kaushiksrivatsan03@gmail.com',
        subject: `New Comment on ${postTypeLabel}: ${data.postSlug}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Comment on Your ${postTypeLabel}!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">${data.postSlug}</p>
            </div>

            <div style="padding: 30px;">
              <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Commenter Information</h2>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #475569; font-size: 14px;">Name:</strong>
                  <div style="color: #1e293b; font-size: 16px; margin-top: 5px;">${escapedName}</div>
                </div>
                <div>
                  <strong style="color: #475569; font-size: 14px;">Email:</strong>
                  <div style="margin-top: 5px;">
                    <a href="mailto:${data.authorEmail}" style="color: #3b82f6; text-decoration: none; font-size: 16px;">${escapedEmail}</a>
                  </div>
                </div>
              </div>

              <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 25px;">
                <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Comment</h2>
                <div style="color: #475569; line-height: 1.6; font-size: 15px; white-space: pre-line;">${escapedContent}</div>
              </div>

              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 12px; text-align: center;">
                <p style="color: white; margin: 0; font-size: 14px;">
                  Visit your site to respond or moderate this comment
                </p>
              </div>
            </div>

            <footer style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                This email was automatically generated from your portfolio comment system.
              </p>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px;">
                Timestamp: ${new Date().toLocaleString('en-US', {
                  timeZone: 'UTC',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} UTC
              </p>
            </footer>
          </div>
        `,
        replyTo: data.authorEmail,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Comment notification sent for ${data.postSlug}`);
      return true;
    } catch (error) {
      console.error('Failed to send comment notification:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const emailService = new EmailService();
