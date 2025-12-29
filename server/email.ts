/// <reference path="../types/resend.d.ts" />
import { Resend } from 'resend';
import type { WorkshopRegistration, LeadershipWorkshopRegistration, JobApplication } from '@shared/schema';

const resendApiKey = (globalThis as { process?: { env?: { RESEND_API_KEY?: string } } }).process?.env?.RESEND_API_KEY;
const resend = new Resend(resendApiKey);
const DEFAULT_FROM = 'Nawa Team <info@nawa.sa>';
const DEFAULT_REPLY_TO = 'info@nawa.sa';

// Email templates
export const createWorkshopConfirmationEmail = (registration: WorkshopRegistration) => {
  const bundleText =
    ({ '89': 'Regular Bundle (89 SAR)', '199': 'Three Friends Bundle (199 SAR)' } as Record<string, string>)[
      String(registration.bundle)
    ] || registration.bundle;

  const paymentText = registration.payment === 'venue' ? 'Venue Payment' : 'Online Payment';

  return {
    subject: 'EQ in the Lab Workshop Confirmation – August 7th, 4pm-10pm',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>EQ in the Lab Workshop Confirmation</title>
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
            <h1>🎉 EQ in the Lab Workshop Confirmation</h1>
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
EQ in the Lab Workshop Confirmation – August 7th, 4pm-10pm

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

// Job Application Confirmation Email
export const createJobApplicationConfirmationEmail = (application: JobApplication) => {
  return {
    subject: 'Job Application Received - NAWA Team',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Job Application Confirmation</title>
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
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-family: 'Inter', sans-serif;
          }
          .application-id {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
            font-family: 'Montserrat', sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${application.firstName} ${application.lastName},</p>
            
            <p>Thank you for your interest in joining the NAWA team! We have successfully received your job application.</p>
            
            <div class="details">
              <h3>Application Details:</h3>
              <p><strong>Application ID:</strong> <span class="application-id">#${application.id}</span></p>
              <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
              <p><strong>Position:</strong> ${application.position}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Phone:</strong> ${application.phone}</p>
              <p><strong>Date Submitted:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            
            <h3>What's Next?</h3>
            <p>Our team will review your application and resume carefully. We typically respond to applications within 5-7 business days.</p>
            
            <p>If your qualifications match our current needs, we'll reach out to schedule an interview or discuss next steps.</p>
            
            <p>In the meantime, feel free to explore our programs and initiatives at <a href="https://nawa.sa" style="color: #1e3a8a;">nawa.sa</a> to learn more about our mission and impact.</p>
            
            <p>If you have any questions about your application, please don't hesitate to contact us at <a href="mailto:info@nawa.sa" style="color: #1e3a8a;">info@nawa.sa</a>.</p>
            
            <p>Thank you again for your interest in joining our mission to empower Saudi youth!</p>
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
Job Application Received - NAWA Team

Dear ${application.firstName} ${application.lastName},

Thank you for your interest in joining the NAWA team! We have successfully received your job application.

Application Details:
- Application ID: #${application.id}
- Name: ${application.firstName} ${application.lastName}
- Position: ${application.position}
- Email: ${application.email}
- Phone: ${application.phone}
- Date Submitted: ${new Date(application.createdAt).toLocaleDateString()}

What's Next?
Our team will review your application and resume carefully. We typically respond to applications within 5-7 business days.

If your qualifications match our current needs, we'll reach out to schedule an interview or discuss next steps.

In the meantime, feel free to explore our programs and initiatives at nawa.sa to learn more about our mission and impact.

If you have any questions about your application, please don't hesitate to contact us at info@nawa.sa.

Thank you again for your interest in joining our mission to empower Saudi youth!

Best regards,
The NAWA Team
    `
  };
};

// Admin Notification Email for Job Applications
export const createJobApplicationAdminNotification = (application: JobApplication) => {
  return {
    subject: `New Job Application Received - ${application.firstName} ${application.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Job Application</title>
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
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-family: 'Inter', sans-serif;
          }
          .application-id {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
            font-family: 'Montserrat', sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Application</h1>
          </div>
          
          <div class="content">
            <p>A new job application has been submitted to NAWA.</p>
            
            <div class="details">
              <h3>Applicant Details:</h3>
              <p><strong>Application ID:</strong> <span class="application-id">#${application.id}</span></p>
              <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
              <p><strong>Position:</strong> ${application.position}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Phone:</strong> ${application.phone}</p>
              <p><strong>Date Submitted:</strong> ${new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            
            <h3>Application Summary:</h3>
            <p><strong>Work Experience:</strong> ${application.workExperience.substring(0, 200)}${application.workExperience.length > 200 ? '...' : ''}</p>
            <p><strong>Education:</strong> ${application.education.substring(0, 200)}${application.education.length > 200 ? '...' : ''}</p>
            <p><strong>Skills:</strong> ${application.skills.substring(0, 200)}${application.skills.length > 200 ? '...' : ''}</p>
            
            <p>Please review the full application and resume in the admin dashboard.</p>
            
            <p>Resume file: ${application.resumePath}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the NAWA application system.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Job Application Received - ${application.firstName} ${application.lastName}

A new job application has been submitted to NAWA.

Applicant Details:
- Application ID: #${application.id}
- Name: ${application.firstName} ${application.lastName}
- Position: ${application.position}
- Email: ${application.email}
- Phone: ${application.phone}
- Date Submitted: ${new Date(application.createdAt).toLocaleDateString()}

Application Summary:
Work Experience: ${application.workExperience.substring(0, 200)}${application.workExperience.length > 200 ? '...' : ''}
Education: ${application.education.substring(0, 200)}${application.education.length > 200 ? '...' : ''}
Skills: ${application.skills.substring(0, 200)}${application.skills.length > 200 ? '...' : ''}

Please review the full application and resume in the admin dashboard.

Resume file: ${application.resumePath}

This is an automated notification from the NAWA application system.
    `
  };
};

// Leadership Workshop Confirmation Email
export const createLeadershipWorkshopConfirmationEmail = (registration: LeadershipWorkshopRegistration) => {
  const paymentText = registration.payment === 'venue' ? 'Pay at Venue' : 'Bank Transfer (IBAN)';

  return {
    subject: 'Public Speaking Workshop Confirmation',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Public Speaking Workshop Confirmation</title>
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
            <h1>🎉 Public Speaking Workshop Confirmation</h1>
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${registration.name}</span>,</p>
            
            <p>Thank you for registering for our upcoming Public Speaking Workshop! We're excited to have you join us for this comprehensive day of learning and practice.</p>
            
            <div class="details">
              <h3>Registration Details:</h3>
              <ul>
                <li><strong>Name:</strong> ${registration.name}</li>
                <li><strong>Email:</strong> ${registration.email}</li>
                <li><strong>Phone:</strong> ${registration.phone}</li>
                <li><strong>Payment Method:</strong> ${paymentText}</li>
                <li><strong>Fee:</strong> 165 SAR</li>
              </ul>
            </div>
            
            <h3>Workshop Details:</h3>
            <p><strong>Date:</strong> January 3rd, 2025</p>
            <p><strong>Time:</strong> 2:00 PM – 8:00 PM</p>
            <p><strong>Location:</strong> J-Hub</p>
            
            <h3>Workshop Schedule:</h3>
            <div class="details">
              <p><strong>2:00 PM - 2:20 PM:</strong> Check-in</p>
              <p><strong>2:20 PM - 3:20 PM:</strong> <strong>Presence (Own the Room)</strong> - Learn how to speak with confidence, make your audience comfortable, and introduce yourself effectively. Master the key elements of presence through 60-second elevator pitches and group activities.</p>
              <p><strong>3:20 PM - 3:40 PM:</strong> Salah Break</p>
              <p><strong>3:40 PM - 4:20 PM:</strong> <strong>Crystal Clear</strong> - Develop crystal-clear communication skills to ensure your message is understood by every member of your audience.</p>
              <p><strong>4:20 PM - 4:30 PM:</strong> Break</p>
              <p><strong>4:30 PM - 5:10 PM:</strong> <strong>Connection (Touch the Hearts)</strong> - Learn to read the room, know your audience, use metaphors effectively, and connect with them emotionally. Participate in the "Save the Kingdom" group challenge crafting compelling 3-act stories.</p>
              <p><strong>5:10 PM - 5:50 PM:</strong> <strong>Interactive Session</strong> - Engage in hands-on activities and interactive exercises to practice your newly acquired skills.</p>
              <p><strong>5:50 PM - 6:20 PM:</strong> Maghrib Salah Break</p>
              <p><strong>6:20 PM - 7:00 PM:</strong> <strong>Adaptation</strong> - Master the "bridge & land" technique in hot-seat rounds. Learn to navigate scrutiny and handle objections with confidence under pressure.</p>
              <p><strong>7:00 PM - 7:50 PM:</strong> <strong>Engagement</strong> - Learn to engage your audience effectively using red/green card feedback system. Gamify clarity under pressure and master audience interaction.</p>
              <p><strong>7:50 PM - 8:00 PM:</strong> Closing Remarks</p>
            </div>
            
            <h3>What to Expect:</h3>
            <p>This intensive one-day workshop will help you master the art of public speaking through six comprehensive sessions. You'll learn how to own the room, speak with confidence, connect with your audience, and navigate scrutiny with ease.</p>
            
            <p>Each session includes hands-on challenges, interactive activities, and practical exercises designed to build your confidence and skills in real-time.</p>
            
            ${registration.payment === 'iban' ? `
            <div class="details" style="background-color: #fff3cd; border: 1px solid #ffc107;">
              <p><strong>Payment Reminder:</strong> If you selected bank transfer, please ensure you have completed the transfer to the provided IBAN. Your seat is confirmed once the transfer is completed.</p>
            </div>
            ` : ''}
            
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
Public Speaking Workshop Confirmation

Dear ${registration.name},

Thank you for registering for our upcoming Public Speaking Workshop! We're excited to have you join us for this comprehensive day of learning and practice.

Registration Details:
- Name: ${registration.name}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Payment Method: ${paymentText}
- Fee: 165 SAR

Workshop Details:
Date: January 3rd, 2025
Time: 2:00 PM – 8:00 PM
Location: J-Hub

Workshop Schedule:
2:00 PM - 2:20 PM: Check-in
2:20 PM - 3:20 PM: Presence (Own the Room) - Learn how to speak with confidence, make your audience comfortable, and introduce yourself effectively. Master the key elements of presence through 60-second elevator pitches and group activities.
3:20 PM - 3:40 PM: Salah Break
3:40 PM - 4:20 PM: Crystal Clear - Develop crystal-clear communication skills to ensure your message is understood by every member of your audience.
4:20 PM - 4:30 PM: Break
4:30 PM - 5:10 PM: Connection (Touch the Hearts) - Learn to read the room, know your audience, use metaphors effectively, and connect with them emotionally. Participate in the "Save the Kingdom" group challenge crafting compelling 3-act stories.
5:10 PM - 5:50 PM: Interactive Session - Engage in hands-on activities and interactive exercises to practice your newly acquired skills.
5:50 PM - 6:20 PM: Maghrib Salah Break
6:20 PM - 7:00 PM: Adaptation - Master the "bridge & land" technique in hot-seat rounds. Learn to navigate scrutiny and handle objections with confidence under pressure.
7:00 PM - 7:50 PM: Engagement - Learn to engage your audience effectively using red/green card feedback system. Gamify clarity under pressure and master audience interaction.
7:50 PM - 8:00 PM: Closing Remarks

What to Expect:
This intensive one-day workshop will help you master the art of public speaking through six comprehensive sessions. You'll learn how to own the room, speak with confidence, connect with your audience, and navigate scrutiny with ease.

Each session includes hands-on challenges, interactive activities, and practical exercises designed to build your confidence and skills in real-time.

${registration.payment === 'iban' ? `
Payment Reminder: If you selected bank transfer, please ensure you have completed the transfer to the provided IBAN. Your seat is confirmed once the transfer is completed.
` : ''}

If you have any questions or need further information, feel free to reach out to us at info@nawa.sa

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
      
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        reply_to: DEFAULT_REPLY_TO,
        to: registration.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('Error sending confirmation email:', error);
        return false;
      }

      console.log(`Confirmation email sent to ${registration.email}: ${data?.id ?? 'no-id'}`);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  },

  async sendLeadershipWorkshopConfirmation(registration: LeadershipWorkshopRegistration): Promise<boolean> {
    try {
      const emailContent = createLeadershipWorkshopConfirmationEmail(registration);
      
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        reply_to: DEFAULT_REPLY_TO,
        to: registration.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('Error sending leadership workshop confirmation email:', error);
        return false;
      }

      console.log(`Leadership workshop confirmation email sent to ${registration.email}: ${data?.id ?? 'no-id'}`);
      return true;
    } catch (error) {
      console.error('Error sending leadership workshop confirmation email:', error);
      return false;
    }
  },

  async sendJobApplicationConfirmation(application: JobApplication): Promise<boolean> {
    try {
      const emailContent = createJobApplicationConfirmationEmail(application);
      
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        reply_to: DEFAULT_REPLY_TO,
        to: application.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('Error sending job application confirmation email:', error);
        return false;
      }

      console.log(`Job application confirmation email sent to ${application.email}: ${data?.id ?? 'no-id'}`);
      return true;
    } catch (error) {
      console.error('Error sending job application confirmation email:', error);
      return false;
    }
  },

  async sendJobApplicationAdminNotification(application: JobApplication): Promise<boolean> {
    try {
      const emailContent = createJobApplicationAdminNotification(application);
      
      const { data, error } = await resend.emails.send({
        from: DEFAULT_FROM,
        reply_to: DEFAULT_REPLY_TO,
        to: 'info@nawa.sa', // Admin email
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (error) {
        console.error('Error sending job application admin notification:', error);
        return false;
      }

      console.log(`Job application admin notification sent: ${data?.id ?? 'no-id'}`);
      return true;
    } catch (error) {
      console.error('Error sending job application admin notification:', error);
      return false;
    }
  },

  async testConnection(): Promise<boolean> {
    try {
      const domains = await resend.domains.list();
      console.log(`Resend connection verified. Domains found: ${domains?.data?.length ?? 0}`);
      return true;
    } catch (error) {
      console.error('Resend connection failed:', error);
      return false;
    }
  }
}; 
