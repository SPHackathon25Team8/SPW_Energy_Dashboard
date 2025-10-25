# Complete File Structure

## Next.js Project Structure

```
scottish-power-energy-dashboard/
│
├── 📁 app/                          # Next.js App Router
│   ├── layout.tsx                   # Root layout with metadata
│   ├── page.tsx                     # Main entry page (home)
│   └── globals.css                  # Global styles & Tailwind config
│
├── 📁 components/                   # React Components
│   │
│   ├── 📁 ui/                       # Shadcn UI Components (40+ files)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   ├── use-mobile.ts
│   │   └── utils.ts
│   │
│   ├── 📁 figma/                    # Figma-specific components
│   │   └── ImageWithFallback.tsx   # (Protected - don't modify)
│   │
│   ├── AIInsightCard.tsx           # AI insight display cards
│   ├── AppSidebar.tsx              # Navigation sidebar
│   ├── DeviceBreakdown.tsx         # Device usage breakdown view
│   ├── DeviceBreakdownChart.tsx    # Device-specific bar chart
│   ├── DeviceConfirmDialog.tsx     # Dialog to confirm device usage
│   ├── DeviceInsightCard.tsx       # Device-specific insight cards
│   ├── DevicesPage.tsx             # Device management page
│   ├── EnergyChart.tsx             # Main energy area chart
│   └── UsagePage.tsx               # Energy usage overview page
│
├── 📁 lib/                          # Utility functions
│   └── utils.ts                    # Helper utilities (cn function)
│
├── 📁 types/                        # TypeScript definitions
│   └── index.ts                    # Shared types & device data
│
├── 📁 public/                       # Static assets
│   └── 📁 images/                   # Image files
│       └── .gitkeep                # Placeholder
│
├── 📁 guidelines/                   # Documentation
│   └── Guidelines.md               # Project guidelines
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 next.config.js                # Next.js configuration
├── 📄 next-env.d.ts                 # Next.js TypeScript declarations
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📄 README.md                     # Project overview
├── 📄 SETUP_INSTRUCTIONS.md         # Setup guide
├── 📄 DEPLOYMENT.md                 # Deployment guide
├── 📄 FILE_STRUCTURE.md             # This file
└── 📄 Attributions.md               # Credits & licenses
```

## File Descriptions

### Core Application Files

| File | Purpose | Type |
|------|---------|------|
| `app/layout.tsx` | Root layout, metadata, global HTML structure | Server Component |
| `app/page.tsx` | Main entry point with state management | Client Component |
| `app/globals.css` | Global styles, Tailwind config, CSS variables | Stylesheet |

### Type Definitions

| File | Purpose |
|------|---------|
| `types/index.ts` | Shared types (Page, DisplayMode, Device), device list |

### Page Components

| File | Purpose | State |
|------|---------|-------|
| `UsagePage.tsx` | Energy usage overview with charts | Client |
| `DevicesPage.tsx` | Device selection and breakdown tabs | Client |

### Chart Components

| File | Purpose | Chart Type |
|------|---------|------------|
| `EnergyChart.tsx` | Main energy consumption chart | Area Chart |
| `DeviceBreakdownChart.tsx` | Device-specific usage chart | Stacked Bar Chart |

### Feature Components

| File | Purpose |
|------|---------|
| `AppSidebar.tsx` | Navigation between pages |
| `DeviceBreakdown.tsx` | Device breakdown container with filters |
| `DeviceConfirmDialog.tsx` | Dialog for confirming device usage |
| `AIInsightCard.tsx` | Display AI-generated insights |
| `DeviceInsightCard.tsx` | Device-specific insights |

### UI Components (Shadcn)

All files in `components/ui/` are pre-built Shadcn components:
- **Forms**: button, input, checkbox, radio-group, select, switch
- **Layout**: card, separator, tabs, accordion
- **Feedback**: alert, dialog, toast (sonner), tooltip
- **Navigation**: sidebar, navigation-menu, breadcrumb
- **Data Display**: table, chart, avatar, badge
- **Overlays**: popover, dropdown-menu, context-menu, sheet
- **And more...**

## Import Path Examples

```typescript
// Page components
import { UsagePage } from '@/components/UsagePage';
import { DevicesPage } from '@/components/DevicesPage';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

// Types
import type { Page, DisplayMode, Device } from '@/types';
import { availableDevices } from '@/types';

// Utilities
import { cn } from '@/lib/utils';

// Icons (external package)
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
```

## Component Hierarchy

```
App (page.tsx)
└── SidebarProvider
    ├── AppSidebar
    │   └── SidebarMenu
    │       ├── Usage Overview MenuItem
    │       └── My Devices MenuItem
    │
    └── Main Content
        ├── UsagePage (when "Usage Overview" selected)
        │   ├── Filter Buttons (Day/Week/Month)
        │   ├── EnergyChart
        │   │   └── Peak Indicators (AlertCircle)
        │   ├── AIInsightCard (multiple)
        │   └── DeviceConfirmDialog
        │
        └── DevicesPage (when "My Devices" selected)
            └── Tabs
                ├── Device Selection Tab
                │   └── Device List (checkboxes)
                │
                └── Usage Breakdown Tab (DeviceBreakdown)
                    ├── Filter Buttons
                    ├── DeviceBreakdownChart
                    │   └── DeviceConfirmDialog
                    └── DeviceInsightCard (multiple)
```

## Data Flow

```
page.tsx (State)
    ├── currentPage: 'usage' | 'devices'
    ├── displayMode: 'kwh' | 'cost'
    └── selectedDevices: string[]
           │
           ├──→ UsagePage
           │      ├── Uses: displayMode, selectedDevices
           │      └── Updates: displayMode
           │
           └──→ DevicesPage
                  ├── Uses: selectedDevices
                  └── Updates: selectedDevices
                         │
                         └──→ DeviceBreakdown
                                └── Uses: selectedDevices
```

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, scripts, project metadata |
| `tsconfig.json` | TypeScript compiler options, path aliases |
| `next.config.js` | Next.js configuration, webpack customization |
| `next-env.d.ts` | Next.js TypeScript declarations (auto-generated) |
| `.gitignore` | Files to exclude from Git |

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, features, getting started |
| `SETUP_INSTRUCTIONS.md` | Developer setup guide, customization |
| `DEPLOYMENT.md` | Production deployment instructions |
| `FILE_STRUCTURE.md` | This file - complete file structure |
| `Attributions.md` | Credits, licenses, acknowledgments |

## Protected Files ⚠️

**Do not modify:**
- `components/figma/ImageWithFallback.tsx` - System component
- `next-env.d.ts` - Auto-generated by Next.js

## File Sizes (Approximate)

- **Total Components**: ~55 files
- **LOC (Lines of Code)**: ~8,000+
- **Bundle Size (production)**: ~200-300 KB (gzipped)
- **Dependencies**: ~50 packages

## Key Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "recharts": "^2.12.0",
  "lucide-react": "^0.395.0",
  "@radix-ui/*": "Various",
  "tailwindcss": "^4.0.0"
}
```

## Build Output

After `npm run build`:

```
.next/
├── cache/              # Build cache
├── server/             # Server-side code
├── static/             # Static assets
└── ...
```

## Environment Files (Create as needed)

```
.env.local              # Local environment variables
.env.development        # Development environment
.env.production         # Production environment
```

## Notes

- All paths use `@/` alias (configured in `tsconfig.json`)
- Client components marked with `'use client'`
- Server components have no directive
- Tailwind v4 uses `@theme` directive in `globals.css`
- Images should be placed in `public/images/`

---

**For more details, see:**
- `SETUP_INSTRUCTIONS.md` - How to set up and customize
- `DEPLOYMENT.md` - How to deploy to production
- `README.md` - Project overview
