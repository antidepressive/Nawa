
A comprehensive web application for NAWA, an organization dedicated to empowering Saudi youth through various programs and initiatives.

## Features

### 🌟 Core Functionality
- **Multilingual Support**: Arabic and English language support
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **SEO Optimized**: Meta tags, structured data, and search engine optimization

### 📋 Programs & Services
- **Nawa Career**: Career development and job placement services
- **Nawa Conferences**: Professional conferences and networking events
- **Saudi MUN Association**: Model United Nations programs
- **Consulting Training Program**: Professional consulting skills development
- **Nawa Workshop**: Hands-on learning workshops

### 💼 Careers System
- **Job Listings**: Dynamic job postings with detailed descriptions
- **Application Form**: Comprehensive job application system
- **Position Tracking**: Track applications by specific positions
- **Email Notifications**: Automated confirmation and admin notifications
- **Admin Dashboard**: Manage applications and submissions

### 📊 Admin Dashboard
- **Data Management**: View, export, and delete submissions
- **Authentication**: Secure password-protected access
- **Bulk Operations**: Select and manage multiple items
- **Real-time Updates**: Live data refresh and status updates

### 💰 Finance Dashboard
- **Transaction Management**: Track income and expenses
- **Budget Planning**: Set and monitor budgets
- **Reports & Analytics**: Generate detailed financial reports
- **Multi-currency Support**: Support for various currencies
- **Data Export**: Export financial data as CSV/PDF

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Lightweight routing library
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Drizzle ORM**: Type-safe database ORM
- **Nodemailer**: Email service integration
- **Multer**: File upload handling

### Development Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: Fast JavaScript bundler
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nawa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/nawa_db
   
   # Email Configuration
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@domain.com
   EMAIL_PASS=your-email-password
   
   # Admin Authentication
   DEVELOPER_TOKEN=your-secure-admin-password
   DELETE_TOKEN=your-secure-delete-password
   
   # Google Analytics
   VITE_GA_MEASUREMENT_ID=your-ga-measurement-id
   
   # Google Drive (Optional - for persistent file storage)
   # Uses OAuth with service account impersonation (works when key creation is disabled)
   GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-oauth-client-secret
   GOOGLE_IMPERSONATE_SERVICE_ACCOUNT=service-account@project.iam.gserviceaccount.com
   GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
   ```

4. **Set up the database**
   The application will automatically create necessary tables on startup.

5. **Set up Google Drive (Optional but Recommended)**
   For persistent file storage (resumes and transaction proofs), set up Google Drive using OAuth with service account impersonation. This method works even when your organization has disabled service account key creation.
   
   **See `GOOGLE_DRIVE_SETUP.md` for detailed step-by-step instructions.**
   
   Quick summary:
   - Create a Google Cloud project and enable Google Drive API
   - Create a service account (no keys needed)
   - Grant yourself "Service Account Token Creator" role
   - Create OAuth Client ID/Secret
   - Create a Google Drive folder and share it with the service account
   - Set environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT`, `GOOGLE_DRIVE_FOLDER_ID`
   
   **Note:** If Google Drive is not configured, files will be stored locally (but may be lost on server restarts on platforms like Render).

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
nawa/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── data/          # Static data and translations
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
│   └── index.html         # HTML template
├── server/                 # Backend Express application
│   ├── routes/            # API route handlers
│   ├── db.ts             # Database connection
│   ├── email.ts          # Email service
│   └── index.ts          # Server entry point
├── shared/                # Shared code between client and server
│   └── schema.ts         # Database schema and validation
├── attached_assets/       # Static assets
│   └── jobDescriptions/  # Job description PDFs
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/workshop` - Register for workshop
- `POST /api/job-applications` - Submit job application
- `POST /api/upload-resume` - Upload resume file

### Protected Endpoints (require authentication)
- `GET /api/contact` - Get all contact submissions
- `GET /api/newsletter` - Get all newsletter subscriptions
- `GET /api/workshop` - Get all workshop registrations
- `GET /api/job-applications` - Get all job applications
- `DELETE /api/contact/:id` - Delete contact submission
- `DELETE /api/newsletter/:id` - Delete newsletter subscription
- `DELETE /api/workshop/:id` - Delete workshop registration
- `DELETE /api/job-applications/:id` - Delete job application

## Database Schema

### Core Tables
- `contact_submissions` - Contact form submissions
- `newsletter_subscriptions` - Newsletter subscribers
- `workshop_registrations` - Workshop registrations
- `job_applications` - Job applications with position tracking
- `users` - Admin users
- `accounts` - Financial accounts
- `categories` - Income/expense categories
- `transactions` - Financial transactions
- `budgets` - Budget plans
- `user_settings` - User preferences

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database URL
- Set up email service credentials
- Configure admin tokens
- Set up Google Analytics tracking

### Server Requirements
- Node.js 18+
- PostgreSQL 12+
- SSL certificate for HTTPS
- Domain name and DNS configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Email: info@nawa.sa
- Website: https://nawa.sa

## Acknowledgments

- Built with modern web technologies
- Designed for accessibility and performance
- Optimized for Saudi Arabian market
- Multilingual support for Arabic and English
