# Deployment Guide - Scottish Power Energy Dashboard

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure (Next.js)

```
scottish-power-energy-dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (main entry point)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── figma/            # Figma-specific components
│   ├── AppSidebar.tsx    # Navigation sidebar
│   ├── UsagePage.tsx     # Energy usage page
│   ├── DevicesPage.tsx   # Device management page
│   └── ...               # Other components
├── lib/                  # Utility functions
│   └── utils.ts         # Helper utilities
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared types
├── public/             # Static assets
│   └── images/        # Image files
├── package.json       # Dependencies
├── next.config.js     # Next.js configuration
└── tsconfig.json      # TypeScript configuration
```

## Environment Setup

### Prerequisites
- **Node.js**: v18.17 or higher
- **npm**, **yarn**, or **pnpm**: Latest version

### Installation Steps

1. **Clone/Extract the project**
   ```bash
   cd scottish-power-energy-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Production Build

### Local Production Build

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

The production build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Image optimization

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel:**
- Built by the Next.js team
- Zero configuration
- Automatic HTTPS
- Global CDN
- Serverless functions support

**Steps:**

1. **Install Vercel CLI (optional)**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Git**
   - Push code to GitHub/GitLab/Bitbucket
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Next.js and deploys!

3. **Deploy via CLI**
   ```bash
   vercel
   ```

**Quick Deploy Button:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GIT_URL)

### Option 2: Netlify

**Steps:**

1. **netlify.toml** (already included)
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Connect your Git repository to Netlify
   - Netlify will automatically detect Next.js
   - Deploy!

### Option 3: AWS Amplify

**Steps:**

1. **amplify.yml** configuration:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

2. **Deploy via Amplify Console**
   - Connect your repository
   - Amplify auto-configures for Next.js
   - Deploy!

### Option 4: Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and run:**
```bash
docker build -t scottish-power-dashboard .
docker run -p 3000:3000 scottish-power-dashboard
```

### Option 5: Traditional Hosting (cPanel, etc.)

Next.js requires Node.js, so static export is needed:

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

**Build:**
```bash
npm run build
```

Upload the `/out` directory to your host.

⚠️ **Note:** This disables server-side features.

## Environment Variables

Create `.env.local` for environment-specific configuration:

```env
# Example configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENERGY_COST_PER_KWH=0.24
```

Access in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Custom Domain

### Vercel
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Automatic SSL certificate

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS
4. Auto SSL

## Performance Optimization

### Already Included:
- ✅ Code splitting
- ✅ Image optimization (Next.js Image component ready)
- ✅ CSS optimization
- ✅ Tree shaking

### Recommendations:
1. **Add Image Optimization**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src="/images/logo.png" 
     alt="Logo" 
     width={200} 
     height={100}
     priority
   />
   ```

2. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
   };
   ```

3. **Add Analytics**
   ```bash
   npm install @vercel/analytics
   ```
   
   ```tsx
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

## Troubleshooting

### Build Errors

**"Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**"Type errors"**
```bash
# Check TypeScript
npm run type-check
```

### Runtime Errors

**"Hydration mismatch"**
- Ensure no `useEffect` rendering differences
- Check server/client component boundaries

**"Cannot find module '@/components/...'"**
- Verify `tsconfig.json` paths configuration
- Restart dev server

### Performance Issues

**Slow builds**
```bash
# Use SWC minifier (already enabled in Next.js 13+)
# Enable build caching
export NEXT_TELEMETRY_DISABLED=1
```

**Large bundle size**
- Use dynamic imports for heavy components
- Analyze bundle: `npm install @next/bundle-analyzer`

## Monitoring

### Recommended Tools:
- **Vercel Analytics** - Built-in performance monitoring
- **Google Analytics** - User analytics
- **Sentry** - Error tracking
- **LogRocket** - Session replay

### Setup Sentry (Example):

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## CI/CD Pipeline

### GitHub Actions Example:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use platform secrets for production

2. **Dependencies**
   ```bash
   # Regular security audits
   npm audit
   npm audit fix
   ```

3. **Headers**
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY',
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff',
             },
           ],
         },
       ];
     },
   };
   ```

## Support

For deployment issues:
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: [Your repo]/issues

## License

MIT License - See LICENSE file for details
