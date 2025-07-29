import nodemailer from 'nodemailer';
import type { WorkshopRegistration } from '@shared/schema';

// Email configuration for Brevo SMTP
const emailConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '78501d002@smtp-brevo.com',
    pass: 'VnvyzIaJN5TdcbMf',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
export const createWorkshopConfirmationEmail = (registration: WorkshopRegistration) => {
  const bundleText = {
    '89': 'Basic Bundle ($89)',
    '59': 'Standard Bundle ($59)',
    '199': 'Premium Bundle ($199)'
  }[registration.bundle] || registration.bundle;

  const paymentText = registration.payment === 'venue' ? 'Venue Payment' : 'Online Payment';

  return {
    subject: 'Workshop Registration Confirmation - NAWA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Workshop Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 10px 10px 0 0;
            color: white;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .content { padding: 20px; }
          .details { background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { color: #007bff; font-weight: bold; }
          .location-link { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 25px; 
            font-weight: bold;
            margin-top: 10px;
          }
          .location-link:hover { 
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Workshop Registration Confirmed!</h1>
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${registration.name}</span>,</p>
            
            <p>Thank you for registering for our workshop! Your registration has been successfully received and confirmed.</p>
            
            <div class="details">
              <h3>Registration Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${registration.name}</li>
                <li><strong>Email:</strong> ${registration.email}</li>
                <li><strong>Phone:</strong> ${registration.phone}</li>
                <li><strong>Bundle:</strong> ${bundleText}</li>
                <li><strong>Payment Method:</strong> ${paymentText}</li>
              </ul>
              
              ${registration.friend1Name ? `
              <h4>Additional Participants:</h4>
              <ul>
                <li><strong>${registration.friend1Name}</strong> - ${registration.friend1Email}</li>
                ${registration.friend2Name ? `<li><strong>${registration.friend2Name}</strong> - ${registration.friend2Email}</li>` : ''}
              </ul>
              ` : ''}
            </div>
            
            <p>We will send you additional details about the workshop schedule, location, and materials closer to the event date.</p>
            
            <p><strong>📍 Workshop Location:</strong></p>
            <p><a href="https://maps.app.goo.gl/PpXypUZ4ugRLGBb67" class="location-link">Click here</a> for directions to the workshop's location</p>
            
            <p>If you have any questions or need to make changes to your registration, please don't hesitate to contact us.</p>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>The NAWA Team</p>
            <p><small>This is an automated confirmation email. Please do not reply to this address.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Workshop Registration Confirmation - NAWA

Dear ${registration.name},

Thank you for registering for our workshop! Your registration has been successfully received and confirmed.

Registration Details:
- Name: ${registration.name}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Bundle: ${bundleText}
- Payment Method: ${paymentText}

${registration.friend1Name ? `
Additional Participants:
- ${registration.friend1Name} - ${registration.friend1Email}
${registration.friend2Name ? `- ${registration.friend2Name} - ${registration.friend2Email}` : ''}
` : ''}

We will send you additional details about the workshop schedule, location, and materials closer to the event date.

If you have any questions or need to make changes to your registration, please don't hesitate to contact us.

Best regards,
The NAWA Team
    `
  };
};

// Email service functions
export const emailService = {
  async sendWorkshopConfirmation(registration: WorkshopRegistration): Promise<boolean> {
    try {
      const emailContent = createWorkshopConfirmationEmail(registration);
      
      const mailOptions = {
        from: 'support@saudimunassociation.com',
        to: registration.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${registration.email}: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  },

  async testConnection(): Promise<boolean> {
    try {
      await transporter.verify();
      console.log('Brevo SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('Brevo SMTP connection failed:', error);
      return false;
    }
  }
}; 
