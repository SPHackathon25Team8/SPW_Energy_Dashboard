# ⚡ Quick Start Guide

Get up and running in 3 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

If you don't have Node.js, download from [nodejs.org](https://nodejs.org/)

## Installation (3 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

⏱️ *This takes 1-2 minutes*

### Step 2: Start Development Server

```bash
npm run dev
```

✅ Server starts at [http://localhost:3000](http://localhost:3000)

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

🎉 **You're done!**

## What You'll See

1. **Sidebar** - Navigate between "Usage Overview" and "My Devices"
2. **Energy Graph** - View consumption by day/week/month
3. **AI Insights** - Smart recommendations
4. **Device Management** - Select and track household devices

## Quick Test

1. Click between Day/Week/Month filters
2. Toggle between kWh and £ (pound icon in top right)
3. Hover over the graph to see device predictions
4. Click the amber warning icons on peaks
5. Navigate to "My Devices" in the sidebar
6. Select some devices
7. Click "Usage Breakdown" tab
8. Click on the bars to confirm device usage

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
```

## First Customizations

### 1. Change Energy Cost

Edit `/components/UsagePage.tsx`:
```typescript
const costPerKwh = 0.24; // Change to your local rate
```

### 2. Add Your Logo

1. Put logo in `/public/images/logo.png`
2. Edit `/components/AppSidebar.tsx`
3. Replace text with Image component

### 3. Change Colors

Edit `/app/globals.css`:
```css
:root {
  --primary: #your-color;
}
```

Or change Tailwind classes:
```tsx
className="bg-green-600" → className="bg-blue-600"
```

## Folder Overview

```
📁 app/          → Main Next.js pages
📁 components/   → React components
📁 types/        → TypeScript types
📁 lib/          → Utilities
📁 public/       → Static files (images)
```

## Key Files

- **`/app/page.tsx`** - Main entry point
- **`/types/index.ts`** - Device list & types
- **`/components/UsagePage.tsx`** - Usage page
- **`/components/DevicesPage.tsx`** - Devices page

## Need Help?

1. **Setup Issues** → Read `SETUP_INSTRUCTIONS.md`
2. **Deployment** → Read `DEPLOYMENT.md`
3. **File Structure** → Read `FILE_STRUCTURE.md`
4. **Errors** → Check the terminal output

## Deploy to Production

**Easiest: Vercel (1-click)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and connect at [vercel.com](https://vercel.com)

## What's Next?

- [ ] Customize branding (logo, colors)
- [ ] Adjust energy rates
- [ ] Add more devices to the list
- [ ] Connect to real energy API
- [ ] Deploy to production
- [ ] Add authentication
- [ ] Add database for history

## Tips

💡 **Hot Reload**: Changes auto-reload in browser  
💡 **Port Busy**: Use `npm run dev -- -p 3001` for different port  
💡 **Clear Cache**: Delete `.next` folder if issues occur  
💡 **TypeScript**: Hover over variables to see types

## Support

- 📖 Full docs in `README.md`
- 🚀 Deployment guide in `DEPLOYMENT.md`
- 🔧 Setup details in `SETUP_INSTRUCTIONS.md`

---

**Happy building! 🎉**
