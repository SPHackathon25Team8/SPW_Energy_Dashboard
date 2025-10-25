# 🏗️ Architecture Overview

Visual guide to how the Scottish Power Energy Dashboard is structured.

## 📊 Application Flow

```
User Opens Browser
        ↓
http://localhost:3000
        ↓
┌─────────────────────────────────────┐
│     app/layout.tsx (Root)           │
│  - Sets up HTML structure           │
│  - Loads global CSS                 │
│  - Defines metadata                 │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│     app/page.tsx (Main)             │
│  - Client Component                 │
│  - State Management:                │
│    • currentPage                    │
│    • displayMode                    │
│    • selectedDevices                │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│     SidebarProvider                 │
│  - Provides sidebar context         │
└─────────────────────────────────────┘
        ↓
    ┌───────┴───────┐
    ↓               ↓
┌─────────┐   ┌──────────────┐
│AppSidebar│   │ Main Content │
│         │   │              │
│ • Usage │   │ Conditional: │
│ Overview│   │              │
│         │   │ if 'usage'   │
│ • My    │   │ → UsagePage  │
│ Devices │   │              │
│         │   │ if 'devices' │
└─────────┘   │ → DevicesPage│
              └──────────────┘
```

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           app/page.tsx (State Owner)            │
│                                                 │
│  State:                                         │
│  • currentPage: 'usage' | 'devices'            │
│  • displayMode: 'kwh' | 'cost'                 │
│  • selectedDevices: string[]                    │
└─────────────────────────────────────────────────┘
         │                    │                    │
         ↓                    ↓                    ↓
    ┌─────────┐      ┌──────────────┐    ┌──────────────┐
    │ Sidebar │      │  UsagePage   │    │ DevicesPage  │
    │         │      │              │    │              │
    │ Reads:  │      │ Reads:       │    │ Reads:       │
    │ current │      │ displayMode  │    │ selected     │
    │ Page    │      │ selectedDev  │    │ Devices      │
    │         │      │              │    │              │
    │ Updates:│      │ Updates:     │    │ Updates:     │
    │ current │      │ displayMode  │    │ selected     │
    │ Page    │      │              │    │ Devices      │
    └─────────┘      └──────────────┘    └──────────────┘
```

## 🎨 Component Architecture

```
App (Root)
│
├── AppSidebar
│   ├── SidebarHeader
│   │   └── Logo
│   └── SidebarMenu
│       ├── Usage Overview (Button)
│       └── My Devices (Button)
│
└── Main Content
    │
    ├── UsagePage
    │   ├── Header
    │   │   ├── Title
    │   │   └── Description
    │   │
    │   ├── Filter Card
    │   │   └── Buttons (Day/Week/Month)
    │   │
    │   ├── Chart Card
    │   │   ├── Title + kWh/£ Toggle
    │   │   └── EnergyChart
    │   │       ├── AreaChart (Recharts)
    │   │       ├── Tooltip
    │   │       └── Peak Indicators
    │   │           └── DeviceConfirmDialog
    │   │
    │   └── Insights Section
    │       └── AIInsightCard (x3)
    │
    └── DevicesPage
        ├── Header
        │
        └── Tabs
            ├── Device Selection Tab
            │   ├── Device List
            │   │   └── Checkbox Items (x10)
            │   └── Status Card
            │
            └── Usage Breakdown Tab
                └── DeviceBreakdown
                    ├── Filter Card
                    ├── Chart Card
                    │   └── DeviceBreakdownChart
                    │       ├── StackedBarChart
                    │       └── DeviceConfirmDialog
                    └── Insights Section
                        └── DeviceInsightCard (per device)
```

## 📁 Folder Architecture

```
Next.js Project
│
├── /app (Next.js App Router)
│   ├── layout.tsx ────→ Root Layout (Server)
│   ├── page.tsx ──────→ Home Page (Client)
│   └── globals.css ───→ Global Styles
│
├── /components (React Components)
│   ├── /ui ───────────→ Shadcn Components (40+)
│   ├── Pages ─────────→ UsagePage, DevicesPage
│   ├── Charts ────────→ EnergyChart, DeviceBreakdownChart
│   ├── Insights ──────→ AIInsightCard, DeviceInsightCard
│   ├── Dialogs ───────→ DeviceConfirmDialog
│   └── Layout ────────→ AppSidebar
│
├── /types (TypeScript)
│   └── index.ts ──────→ Shared Types + Device Data
│
├── /lib (Utilities)
│   └── utils.ts ──────→ cn() helper
│
└── /public (Static)
    └── /images ───────→ Logo, Assets
```

## 🔌 Data Dependencies

```
types/index.ts
    ↓
    Exports:
    • Device interface
    • Page type
    • DisplayMode type
    • availableDevices[]
    ↓
    Used by:
    ↓
┌───────────────┬──────────────────┬──────────────────┐
│               │                  │                  │
app/page.tsx    UsagePage.tsx      DevicesPage.tsx    etc.
    ↓               ↓                   ↓
Import with:    Import with:       Import with:
@/types         @/types            @/types
```

## 🎯 Interaction Flow

### Viewing Energy Usage

```
1. User visits site
   ↓
2. app/page.tsx loads
   ↓
3. Default: currentPage = 'usage'
   ↓
4. Renders UsagePage
   ↓
5. UsagePage shows:
   - Filter buttons
   - EnergyChart (day data)
   - AI insights
   ↓
6. User clicks "Week"
   ↓
7. State updates: selectedFilter = 'week'
   ↓
8. Chart re-renders with week data
```

### Confirming Device Usage

```
1. User on UsagePage
   ↓
2. Peak indicator visible (AlertCircle)
   ↓
3. User clicks peak
   ↓
4. onPeakClick(timeSlot, data)
   ↓
5. State updates: dialogOpen = true
   ↓
6. DeviceConfirmDialog opens
   ↓
7. Shows predicted devices for that time
   ↓
8. User toggles device checkboxes
   ↓
9. User clicks "Save Feedback"
   ↓
10. onUpdateConfirmation(...)
    ↓
11. confirmations array updates
    ↓
12. Dialog closes
    ↓
13. Updated data used for predictions
```

### Managing Devices

```
1. User clicks "My Devices" in sidebar
   ↓
2. onPageChange('devices')
   ↓
3. State updates: currentPage = 'devices'
   ↓
4. DevicesPage renders
   ↓
5. Default tab: "Device Selection"
   ↓
6. User selects devices
   ↓
7. setSelectedDevices([...])
   ↓
8. State updates in app/page.tsx
   ↓
9. User clicks "Usage Breakdown" tab
   ↓
10. DeviceBreakdown renders
    ↓
11. Shows chart with selected devices only
```

## 🔄 Client vs Server Components

```
Server Components (No 'use client')
├── app/layout.tsx
└── Static UI parts

Client Components ('use client')
├── app/page.tsx
├── components/UsagePage.tsx
├── components/DevicesPage.tsx
├── components/DeviceBreakdown.tsx
├── components/EnergyChart.tsx
├── components/DeviceBreakdownChart.tsx
└── components/DeviceConfirmDialog.tsx

Server Components can import Client Components ✅
Client Components can import Server Components ❌
```

## 📊 Chart Architecture

### EnergyChart (Area Chart)

```
EnergyChart.tsx
├── Data: dayData | weekData | monthData
├── Recharts Components:
│   ├── ResponsiveContainer
│   ├── AreaChart
│   │   ├── CartesianGrid
│   │   ├── XAxis
│   │   ├── YAxis
│   │   ├── Tooltip (CustomTooltip)
│   │   └── Area
│   └── Peak Overlays (absolute positioned)
└── Props:
    ├── filter: 'day' | 'week' | 'month'
    ├── displayMode: 'kwh' | 'cost'
    ├── selectedDevices: string[]
    └── onPeakClick?: (timeSlot, data) => void
```

### DeviceBreakdownChart (Stacked Bar)

```
DeviceBreakdownChart.tsx
├── Data: generateDayData() | generateWeekData() | generateMonthData()
├── Recharts Components:
│   ├── ResponsiveContainer
│   ├── BarChart
│   │   ├── CartesianGrid
│   │   ├── XAxis
│   │   ├── YAxis
│   │   ├── Tooltip
│   │   ├── Legend
│   │   └── Bar (per device, stacked)
│   └── Click Handler → DeviceConfirmDialog
└── Props:
    ├── filter: 'day' | 'week' | 'month'
    ├── selectedDevices: string[]
    ├── confirmations: DeviceUsageConfirmation[]
    └── onUpdateConfirmation: (slot, device, inUse) => void
```

## 🎨 Styling Architecture

```
Tailwind CSS v4
    ↓
app/globals.css
    ↓
Contains:
├── CSS Custom Properties
│   ├── Light theme variables
│   └── Dark theme variables
├── @theme inline
│   └── Tailwind color mappings
└── @layer base
    └── Typography defaults

Components use:
├── Tailwind classes directly
│   className="bg-green-600 text-white"
├── CSS variables
│   var(--color-primary)
└── cn() utility
    Merges classes with tailwind-merge
```

## 🔐 Type Safety

```
TypeScript
    ↓
tsconfig.json
├── Strict mode enabled
├── Path aliases (@/)
└── Next.js types included
    ↓
types/index.ts
├── Page type
├── DisplayMode type
├── Device interface
└── availableDevices constant
    ↓
All Components
├── Typed props
├── Typed state
├── Typed functions
└── IntelliSense support
```

## 🚀 Build Process

```
Development (npm run dev)
    ↓
Next.js Dev Server
├── Hot Module Replacement
├── Fast Refresh
├── Source maps
└── Dev-only features
    ↓
Browser (localhost:3000)

Production (npm run build)
    ↓
Next.js Build
├── TypeScript compilation
├── Tailwind processing
├── Code splitting
├── Tree shaking
├── Minification
└── Optimization
    ↓
.next/
├── /server (Server code)
├── /static (Static assets)
└── Optimized bundles
    ↓
Deploy (npm start or Vercel)
```

## 📦 Dependency Graph

```
Application Code
    ↓
├── React 18 ──────────→ Core framework
├── Next.js 14 ────────→ Framework + routing
├── TypeScript ────────→ Type safety
│
├── UI Libraries
│   ├── Tailwind CSS ──→ Styling
│   ├── Shadcn UI ─────→ Component library
│   └── Radix UI ──────→ Primitive components
│
├── Charts
│   └── Recharts ──────→ Data visualization
│
├── Icons
│   └── Lucide React ──→ Icon library
│
└── Utilities
    ├── clsx ──────────→ Class name helper
    └── tailwind-merge → Class merging
```

## 🎯 Performance Strategy

```
Code Splitting
    ↓
Automatic (Next.js)
├── Each route = separate bundle
├── Shared code = common chunks
└── Dynamic imports supported

Image Optimization
    ↓
Next.js Image Component
├── Lazy loading
├── Responsive images
├── Format optimization
└── CDN ready

CSS Optimization
    ↓
Tailwind CSS v4
├── Purge unused CSS
├── Minification
└── Critical CSS inlining

Bundle Optimization
    ↓
Next.js Build
├── Tree shaking
├── Minification
├── Compression
└── ~200-300 KB gzipped
```

## 🔍 File Naming Conventions

```
Files
├── Components: PascalCase.tsx
│   Example: EnergyChart.tsx
│
├── Pages: lowercase.tsx (Next.js convention)
│   Example: page.tsx, layout.tsx
│
├── Utilities: lowercase.ts
│   Example: utils.ts
│
├── Types: lowercase.ts
│   Example: index.ts
│
└── Styles: lowercase.css
    Example: globals.css

Folders
└── lowercase, kebab-case
    Example: components/ui/
```

## 🎨 Design System

```
Color Palette (from globals.css)
├── Primary: Green (Scottish Power brand)
├── Secondary: Slate/Gray
├── Accent: Orange (insights)
├── Success: Green
├── Warning: Amber (peaks)
├── Error: Red
└── Neutral: Gray scale

Typography
├── Headings: var(--font-weight-medium)
├── Body: var(--font-weight-normal)
└── Scale: Base 16px

Spacing
├── Tailwind default scale
└── Custom: --radius (0.625rem)

Components
└── Shadcn UI theme
```

## 📈 Scalability Considerations

```
Current Structure
└── Simple state in page.tsx
    ↓
    Good for: < 10 pages

If Scaling Up
├── Add state management
│   ├── Zustand
│   ├── Redux Toolkit
│   └── React Context
│
├── Add data fetching
│   ├── React Query
│   ├── SWR
│   └── Next.js Server Actions
│
└── Add backend
    ├── API routes in /app/api
    ├── Database (Supabase, etc.)
    └── Authentication
```

## 🔒 Security Architecture

```
Frontend (Current)
├── No sensitive data in code ✅
├── Environment variables ready
└── HTTPS via deployment platform

When Adding Backend
├── API routes in /app/api
├── Environment variables in .env.local
├── Rate limiting recommended
├── CORS configuration
└── Input validation
```

---

## 📊 Summary

- **Architecture**: Modern Next.js App Router
- **State**: React hooks (simple, effective)
- **Styling**: Tailwind CSS v4
- **Components**: Modular, reusable
- **Type Safety**: Full TypeScript
- **Performance**: Optimized builds
- **Scalability**: Ready to extend

For implementation details, see:
- [FILE_STRUCTURE.md](FILE_STRUCTURE.md) - File organization
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - How to build
- [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy
