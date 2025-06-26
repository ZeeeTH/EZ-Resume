# EZ Resume - AI-Powered Resume & Cover Letter Generator

A professional website built with Next.js that helps users create compelling resumes and cover letters using AI technology.

## Features

- 🤖 AI-powered resume and cover letter generation
- 💳 Stripe integration for payments
- 📧 Gmail integration for email delivery
- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API
- **Payments**: Stripe
- **Email**: Nodemailer with Gmail
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Stripe account and API keys
- Gmail account for email delivery

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd EZ-Resume
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Gmail
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the following environment variables in Vercel:
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

4. Deploy!

## Project Structure

```
EZ-Resume/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── templates/             # Email templates
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 