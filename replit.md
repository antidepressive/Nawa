# NAWA AlAthr - Saudi Youth Development Platform

## Overview

NAWA AlAthr is a comprehensive Saudi youth development platform that empowers young people through career development, conferences, and Model United Nations programs. The application serves as a corporate website showcasing the organization's programs, impact statistics, and partnership opportunities aligned with Saudi Arabia's Vision 2030.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component system
- **State Management**: React Context API for language management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful API with /api prefix for all endpoints

### UI Component System
- **Design System**: shadcn/ui components built on Radix UI primitives
- **Theme**: Custom color palette with CSS variables
- **Typography**: Montserrat for headings, Inter for body text, Cairo/Tajawal for Arabic support
- **Responsiveness**: Mobile-first design with Tailwind CSS breakpoints

## Key Components

### Internationalization
- **Language Support**: English and Arabic with RTL support
- **Context Provider**: React Context for language state management
- **Font Switching**: Automatic font family switching based on language
- **Direction Support**: Dynamic HTML dir attribute management

### Analytics Integration
- **Platform**: Google Analytics 4
- **Page Tracking**: Automatic page view tracking with wouter router
- **Event Tracking**: Custom event tracking for user interactions
- **Environment Variables**: Configurable measurement ID

### Form Management
- **Validation**: React Hook Form with Zod schema validation
- **UI Components**: shadcn/ui form components
- **Toast Notifications**: Radix UI toast system for user feedback

### Database Schema
- **Users Table**: Basic user authentication structure
- **Contact Submissions**: Stores contact form data with name, organization, email, phone, interest area, and message
- **Newsletter Subscriptions**: Stores email addresses for newsletter subscribers
- **Schema Definition**: Drizzle ORM with Zod integration and PostgreSQL backend
- **Type Safety**: Full TypeScript support with inferred types

## Data Flow

### Client-Side Rendering
1. Vite serves the React application during development
2. Components consume data through React Query
3. Language context provides translation and direction state
4. Analytics hooks track user interactions and page views

### Server-Side Processing
1. Express server handles API requests with /api prefix
2. Drizzle ORM manages database operations
3. Session middleware handles user authentication
4. Error middleware provides centralized error handling

### Asset Management
- **Static Assets**: Served from public directory
- **PDF Documents**: Sponsorship materials and impact reports
- **Images**: Optimized for web delivery with proper alt text

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Query
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS, Radix UI components
- **Form Handling**: React Hook Form, Hookform Resolvers
- **Database**: Drizzle ORM, Neon Database connector
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date formatting

### Development Dependencies
- **Build Tools**: Vite, ESBuild for server bundling
- **TypeScript**: Full TypeScript support across the stack
- **Linting**: ESLint configuration
- **Process Management**: tsx for TypeScript execution

### External Services
- **Database**: Neon Database (serverless PostgreSQL)
- **Analytics**: Google Analytics 4
- **Fonts**: Google Fonts (Montserrat, Inter, Cairo, Tajawal)
- **Deployment**: Replit deployment platform

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with npm package management
- **Database**: PostgreSQL 16 module
- **Hot Reloading**: Vite development server with HMR
- **Error Overlay**: Replit runtime error modal integration

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: ESBuild bundles server code for production
- **Database**: Drizzle migrations applied via npm script
- **Deployment**: Autoscale deployment target on Replit

### Environment Configuration
- **Database URL**: Required environment variable for database connection
- **Analytics ID**: Google Analytics measurement ID
- **Port Configuration**: Configurable port with default 5000

## Changelog

```
Changelog:
- June 20, 2025. Initial setup and complete bilingual website implementation
- June 20, 2025. Brand updates: Changed "NAWA AlAthr" to "Nawa", implemented custom logo, updated hero subtitle, modified stats counters, removed testimonials section, updated partner logos
- June 20, 2025. Database integration: Added PostgreSQL database with contact form submissions and newsletter subscriptions storage, implemented API endpoints for form handling
- June 20, 2025. Major site updates: Updated logo to new blue Arabic calligraphy design, fixed navigation smooth scrolling, updated contact info (+966 538 104 164, info@nawa.sa), added new Jeddah address with Google Maps, created legal pages and program sub-pages with proper routing
- June 21, 2025. SEO and branding updates: Updated all page titles to "Nawa - نَوَاة", implemented favicon with blue Arabic calligraphy logo, updated meta descriptions and Open Graph tags with "Planting today, the leaders of tomorrow" tagline for improved social media sharing
- June 23, 2025. Footer navigation improvements: Fixed Arabic RTL navigation ordering, added complete contact information section to footer with proper left-side positioning, improved bilingual layout consistency
- June 23, 2025. New program page: Added Consulting Training Program (CTP) page featuring 12-day intensive bootcamp in Jeddah, connected "Start your Development Journey" hero button to CTP page, implemented comprehensive program information with bilingual support
- June 23, 2025. CTP page updates: Applied nawa-background.png to hero section and footer backgrounds, removed "(CTP)" text from program name, removed "Learn More" button leaving only "Register Now", removed Arabic text from partners section, added back to home navigation button, aligned industry leaders grid layout, added curriculum overview buttons linking to CTP-NAWA.pdf, implemented comprehensive RTL text alignment for Arabic content including feature cards and bullet points
- June 23, 2025. Career page enhancement: Added "Current Programs" section to NAWA career page featuring the CTP program with detailed description, key features, and action buttons linking to the full program page
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```