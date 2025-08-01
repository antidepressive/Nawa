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
    '89': 'Regular Bundle (89 SAR)',
    '199': 'Three Friends Bundle (199 SAR)'
  }[registration.bundle] || registration.bundle;

  const paymentText = registration.payment === 'venue' ? 'Venue Payment' : 'Online Payment';

  return {
    subject: 'Workshop Confirmation – August 7th, 4pm-10pm',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Workshop Confirmation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #000000; 
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            margin: 0;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            padding: 30px 20px; 
            text-align: center; 
            color: white;
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
            font-family: 'Montserrat', sans-serif;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .content { 
            padding: 20px; 
            background: white;
            color: #000000;
            font-family: 'Inter', sans-serif;
          }
          .content p {
            color: #000000;
            margin-bottom: 15px;
            font-family: 'Inter', sans-serif;
          }
          .content h3 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            color: #000000;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .details { 
            background-color: #f8f9fa; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px; 
            color: #000000;
            font-family: 'Inter', sans-serif;
          }
          .details h3 {
            color: #000000;
            margin-top: 0;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
          }
          .details h4 {
            color: #000000;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            margin-top: 15px;
            margin-bottom: 10px;
          }
          .details ul {
            color: #000000;
            font-family: 'Inter', sans-serif;
          }
          .details li {
            color: #000000;
            font-family: 'Inter', sans-serif;
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #000000; 
            font-size: 14px; 
            background: white;
            font-family: 'Inter', sans-serif;
          }
          .highlight { 
            color: #000000; 
            font-weight: bold; 
            font-family: 'Inter', sans-serif;
          }
          .whatsapp-link { 
            display: inline-block; 
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            color: white !important; 
            padding: 10px 20px; 
            text-decoration: none !important; 
            border-radius: 25px; 
            font-weight: bold;
            font-family: 'Inter', sans-serif;
            margin-top: 10px;
          }
          .whatsapp-link:hover { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white !important;
          }
          .whatsapp-link:visited {
            color: white !important;
          }
          .whatsapp-link:active {
            color: white !important;
          }
          .location-link { 
            display: inline-block; 
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            color: white !important; 
            padding: 10px 20px; 
            text-decoration: none !important; 
            border-radius: 25px; 
            font-weight: bold;
            font-family: 'Inter', sans-serif;
            margin-top: 10px;
          }
          .location-link:hover { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white !important;
          }
          .location-link:visited {
            color: white !important;
          }
          .location-link:active {
            color: white !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Workshop Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${registration.name}</span>,</p>
            
            <p>Thank you for registering for our upcoming workshop! We're excited to have you join us.</p>
            
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
            
            <h3>Workshop Details:</h3>
            <p><strong>Date:</strong> August 7th</p>
            <p><strong>Time:</strong> 4:00 PM – 10:00 PM</p>
            <p><strong>Location:</strong> JHUB</p>
            <p><a href="https://maps.app.goo.gl/PpXypUZ4ugRLGBb67" class="location-link">Click here for directions</a></p>
            
            <p>To help everyone stay connected and up-to-date, please join our WhatsApp group using the link below:</p>
            <p><a href="https://chat.whatsapp.com/HGU1XLxyqIbB4wCB5fxI5C?mode=ac_t" class="whatsapp-link">Join WhatsApp Group</a></p>
            
            <p>If you have any questions or need further information, feel free to reach out to us at <a href="mailto:info@nawa.sa" style="color: #000000;">info@nawa.sa</a></p>
            
            <p>Looking forward to seeing you there!</p>
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
Workshop Confirmation – August 7th, 4pm-10pm

Dear ${registration.name},

Thank you for registering for our upcoming workshop! We're excited to have you join us.

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

Workshop Details:
Date: August 7th
Time: 4:00 PM – 10:00 PM
Location: JHUB (https://maps.app.goo.gl/PpXypUZ4ugRLGBb67)

To help everyone stay connected and up-to-date, please join our WhatsApp group using the link below:
Join WhatsApp Group: https://chat.whatsapp.com/HGU1XLxyqIbB4wCB5fxI5C?mode=ac_t

Feel free to reach out to us at info@nawa.sa If you have any questions or need further information. 

Looking forward to seeing you there!

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
