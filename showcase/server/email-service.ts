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
      const mailOptions = {
        from: process.env.SMTP_USER || 'noreply@portfolio.com',
        to: 'kaushiksrivatsan03@gmail.com', // Your email where you want to receive messages
        subject: `New Contact Form Message from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1a202c; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="color: #1a202c; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e6fffa; border-radius: 8px; border-left: 4px solid #38b2ac;">
              <p style="margin: 0; color: #1a202c;">
                <strong>Quick Actions:</strong><br>
                Reply directly to <a href="mailto:${data.email}">${data.email}</a> or 
                add this contact to your CRM system.
              </p>
            </div>
            
            <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 12px;">
              <p>This email was sent from your portfolio contact form.</p>
            </footer>
          </div>
        `,
        replyTo: data.email,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Contact email sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send contact email:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const emailService = new EmailService();
