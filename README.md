# Portfolio Jorian

## Overview
My portfolio is a modern, customizable web application designed to showcase my projects, skills, and professional experience. It serves as a central hub for my digital portfolio.

## Purpose
This application provides a professional platform to highlight my projects, skills, and experiences in a visually appealing and user-friendly interface.

## Key Features
- **Project Showcase**: Display my projects with detailed descriptions, images, and links
- **Customizable Content**: Easily update and manage my portfolio content through a Supabase backend
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Admin Dashboard**: Manage projects, content, and contact messages
- **Contact Form**: Allow visitors to send me messages directly through the site
- **Media Library**: Store and manage images and other media files
- **Skills & Experience**: Highlight my technical skills and professional experience

## Technologies Used
- **Frontend**:
  - React.js with TypeScript
  - Vite as the build tool
  - Tailwind CSS for styling
  - Shadcn UI components
  - React Router for navigation
  - React Query for data fetching
  - React Hook Form for form handling
  - DND Kit for drag-and-drop functionality

- **Backend & Storage**:
  - Supabase for database and authentication
  - Supabase Storage for media files

- **Deployment**:
  - Configuration for Vercel and Netlify included

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jorianvanbelle/jorian-portfolio-hub.git
   cd jorian-portfolio-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase Configuration
This portfolio uses a Supabase database with specific tables and storage setup. Refer to the `SUPABASE_SETUP.md` file for detailed instructions on:
- Creating required database tables
- Setting up storage buckets
- Configuring Row Level Security (RLS) policies
- Setting up authentication

## Admin Setup
For admin functionality, follow the instructions in `ADMIN_SETUP.md` to:
- Create admin users
- Configure admin-only features
- Set up the admin dashboard

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview the built application
- `npm run lint` - Run ESLint to check code quality
- `npm run migrate-projects` - Run the project migration script

## Badges

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-brightgreen.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-green.svg)](https://supabase.io/)
[![React Query](https://img.shields.io/badge/React_Query-5.x-ff4154.svg)](https://tanstack.com/query/latest)
[![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245.svg)](https://reactrouter.com/)



## License
This project is licensed under the MIT License - see the LICENSE file for details. 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)