# Setup Instructions - Scottish Power Energy Dashboard

## For Developers: Quick Setup

### 1. Extract/Clone the Project

```bash
cd scottish-power-energy-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS v4
- Shadcn UI components
- Recharts
- Lucide React icons

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Files Overview

### Core Files

- **`/app/page.tsx`** - Main application entry point
- **`/app/layout.tsx`** - Root layout with metadata
- **`/app/globals.css`** - Global styles and Tailwind configuration
- **`/types/index.ts`** - Shared TypeScript types and constants

### Component Organization

```
/components/
├── ui/                    # Shadcn UI components (pre-built)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ... (40+ components)
├── AppSidebar.tsx         # Navigation sidebar
├── UsagePage.tsx          # Energy usage overview page
├── DevicesPage.tsx        # Device management page
├── EnergyChart.tsx        # Main energy chart component
├── DeviceBreakdown.tsx    # Device usage breakdown
├── DeviceBreakdownChart.tsx  # Device-specific charts
├── DeviceConfirmDialog.tsx   # Dialog for confirming device usage
├── AIInsightCard.tsx      # AI insight cards
└── DeviceInsightCard.tsx  # Device-specific insights
```

### Configuration Files

- **`package.json`** - Dependencies and scripts
- **`next.config.js`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`.gitignore`** - Git ignore rules

## Key Features

### 1. Usage Overview Page
- Energy consumption graphs (day/week/month)
- Toggle between kWh and cost (£)
- Peak usage indicators
- AI-powered insights
- Click peaks to review device usage

### 2. Device Management
- **Device Selection Tab**: Choose household devices
- **Usage Breakdown Tab**: View device-specific consumption
- Click on charts to confirm/correct AI predictions
- Device-specific insights and recommendations

### 3. Interactive Features
- **Peak Detection**: Alerts on high usage periods
- **Device Confirmation**: Review and correct AI predictions
- **Responsive Design**: Works on mobile and desktop
- **Real-time Updates**: Immediate UI feedback

## Customization Guide

### Change Energy Cost Rate

Edit `/components/UsagePage.tsx` and `/components/DeviceBreakdownChart.tsx`:

```typescript
const costPerKwh = 0.24; // Change this value
```

### Add New Devices

Edit `/types/index.ts`:

```typescript
export const availableDevices: Device[] = [
  // ... existing devices
  { 
    id: 'new-device', 
    name: 'New Device', 
    icon: '⚡', 
    avgPower: 1500 // watts
  },
];
```

### Update Branding

#### Logo
1. Add logo image to `/public/images/logo.png`
2. Edit `/components/AppSidebar.tsx`:

```typescript
import Image from 'next/image';

// Replace text with:
<Image 
  src="/images/logo.png" 
  alt="Scottish Power" 
  width={128} 
  height={48}
  priority
/>
```

#### Colors
Edit `/app/globals.css` to change the color scheme:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... other color variables */
}
```

Or use Tailwind classes directly:
```tsx
className="bg-green-600" // Change to bg-blue-600, etc.
```

### Add New Insights

Edit the `insights` object in `/components/UsagePage.tsx`:

```typescript
const insights: Record<TimeFilter, InsightData[]> = {
  day: [
    {
      icon: TrendingDown,
      title: 'Your Custom Title',
      description: 'Your custom description',
      trend: 'neutral',
    },
  ],
  // ... week, month
};
```

## File Import Paths

This project uses the `@/` alias for imports:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button';
import { availableDevices } from '@/types';

// ❌ Incorrect (don't use relative paths)
import { Button } from '../components/ui/button';
import { availableDevices } from '../types';
```

## Component Architecture

### Client vs Server Components

**Client Components** (uses `'use client'` directive):
- `/app/page.tsx` - Main page with state
- All interactive components (charts, buttons, dialogs)

**Server Components** (no directive):
- `/app/layout.tsx` - Layout
- Static UI components

### State Management

State is managed using React hooks:
- `useState` - Local component state
- Props drilling for shared state (currentPage, displayMode, selectedDevices)

For larger apps, consider:
- Zustand
- Redux Toolkit
- React Context

## Development Tips

### Hot Reload
Changes to any file trigger automatic reloading. If it doesn't work:

```bash
# Restart dev server
Ctrl+C
npm run dev
```

### TypeScript Errors
Check types:

```bash
npm run type-check  # If configured
# or
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Clear Cache
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Adding New Pages

1. Create file in `/app/new-page/page.tsx`:

```typescript
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. Access at `/new-page`

For dynamic routes:
```
/app/devices/[id]/page.tsx  → /devices/123
```

## API Integration

To add backend API calls:

1. Create API route:
```typescript
// /app/api/energy/route.ts
export async function GET() {
  const data = await fetchEnergyData();
  return Response.json(data);
}
```

2. Call from component:
```typescript
const response = await fetch('/api/energy');
const data = await response.json();
```

## Testing

### Manual Testing Checklist
- [ ] All charts render correctly
- [ ] Device selection updates charts
- [ ] kWh/£ toggle works
- [ ] Peak indicators are clickable
- [ ] Device confirmation dialog works
- [ ] Sidebar navigation functions
- [ ] Mobile responsive design
- [ ] All insights display

### Add Automated Tests

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create `/components/Button.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## Common Issues

### Issue: "Module not found"
**Solution:** Check import paths use `@/` prefix

### Issue: "Hydration mismatch"
**Solution:** Ensure no random data generation during SSR

### Issue: Charts not displaying
**Solution:** Check Recharts is installed: `npm list recharts`

### Issue: Tailwind classes not working
**Solution:** Restart dev server, check `globals.css` is imported

## Performance Tips

1. **Image Optimization**
   ```tsx
   import Image from 'next/image';
   // Use Image component for better performance
   ```

2. **Code Splitting**
   ```tsx
   import dynamic from 'next/dynamic';
   const Chart = dynamic(() => import('@/components/Chart'), {
     ssr: false,
   });
   ```

3. **Memoization**
   ```tsx
   import { memo } from 'react';
   export const Component = memo(({ data }) => {
     // Component code
   });
   ```

## Next Steps

1. **Add Authentication**
   - NextAuth.js
   - Clerk
   - Auth0

2. **Add Database**
   - Supabase
   - MongoDB
   - PostgreSQL

3. **Add Real Data**
   - Connect to energy monitoring API
   - Store historical data
   - Implement real AI predictions

4. **Deploy**
   - See `DEPLOYMENT.md` for full guide
   - Recommended: Vercel (1-click deploy)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

## Support

For questions or issues:
1. Check this documentation
2. Review `DEPLOYMENT.md`
3. Check Next.js documentation
4. Open an issue on GitHub

---

**Happy coding! 🚀**
