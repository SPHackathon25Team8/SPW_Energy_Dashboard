# 📋 Getting Started Checklist

Use this checklist to get your Scottish Power Energy Dashboard up and running.

## ✅ Phase 1: Initial Setup (10 minutes)

- [ ] **1.1** Read `EXPORT_SUMMARY.md` to understand what you received
- [ ] **1.2** Check Node.js is installed (`node --version` - need 18+)
- [ ] **1.3** Navigate to project folder in terminal
- [ ] **1.4** Run `npm install` and wait for completion
- [ ] **1.5** Run `npm run dev` to start development server
- [ ] **1.6** Open http://localhost:3000 in browser
- [ ] **1.7** Verify the dashboard loads correctly
- [ ] **1.8** Test navigation: click "Usage Overview" and "My Devices"
- [ ] **1.9** Test filters: Day, Week, Month buttons
- [ ] **1.10** Toggle between kWh and £ (pound icon)

**✨ Success Criteria**: Dashboard loads, all buttons work, no console errors

---

## ✅ Phase 2: Basic Customization (30 minutes)

### Branding
- [ ] **2.1** Add your logo image to `/public/images/logo.png`
- [ ] **2.2** Update logo in `/components/AppSidebar.tsx`
  ```tsx
  // Replace text with:
  import Image from 'next/image';
  <Image src="/images/logo.png" alt="Logo" width={128} height={48} />
  ```
- [ ] **2.3** Test logo displays correctly

### Energy Rates
- [ ] **2.4** Open `/components/UsagePage.tsx`
- [ ] **2.5** Find `const costPerKwh = 0.24;`
- [ ] **2.6** Change to your local energy rate
- [ ] **2.7** Repeat for `/components/DeviceBreakdownChart.tsx`
- [ ] **2.8** Test £ values update correctly

### Colors (Optional)
- [ ] **2.9** Open `/app/globals.css`
- [ ] **2.10** Update CSS variables if desired
- [ ] **2.11** Or change Tailwind classes in components
  ```tsx
  // Change green to your brand color
  className="bg-green-600" → className="bg-blue-600"
  ```
- [ ] **2.12** Test color changes appear correctly

**✨ Success Criteria**: Logo shows, rates are correct, colors match brand

---

## ✅ Phase 3: Content Customization (1 hour)

### Devices
- [ ] **3.1** Open `/types/index.ts`
- [ ] **3.2** Review `availableDevices` array
- [ ] **3.3** Add any missing devices for your use case
  ```typescript
  { id: 'device-name', name: 'Device Name', icon: '🔌', avgPower: 1000 }
  ```
- [ ] **3.4** Remove irrelevant devices
- [ ] **3.5** Test device selection works

### Insights
- [ ] **3.6** Open `/components/UsagePage.tsx`
- [ ] **3.7** Find `const insights` object
- [ ] **3.8** Customize insight titles and descriptions
- [ ] **3.9** Open `/components/DeviceInsightCard.tsx`
- [ ] **3.10** Customize device-specific insights
- [ ] **3.11** Test insights display correctly

### Text & Copy
- [ ] **3.12** Update page titles if needed
- [ ] **3.13** Update helper text
- [ ] **3.14** Update tooltips
- [ ] **3.15** Test all text changes

**✨ Success Criteria**: Content reflects your brand and use case

---

## ✅ Phase 4: Testing (30 minutes)

### Functionality Testing
- [ ] **4.1** Test all three time filters (Day/Week/Month)
- [ ] **4.2** Toggle kWh/£ multiple times
- [ ] **4.3** Hover over graphs - tooltips should show
- [ ] **4.4** Click peak indicators (amber warnings)
- [ ] **4.5** Test device confirmation dialog
- [ ] **4.6** Navigate to "My Devices"
- [ ] **4.7** Select/deselect devices
- [ ] **4.8** Click "Usage Breakdown" tab
- [ ] **4.9** Click on bar chart sections
- [ ] **4.10** Verify device confirmation saves

### Responsive Testing
- [ ] **4.11** Test on mobile screen size (resize browser)
- [ ] **4.12** Test on tablet screen size
- [ ] **4.13** Test on desktop
- [ ] **4.14** Verify sidebar works on mobile
- [ ] **4.15** Verify charts are readable on all sizes

### Browser Testing
- [ ] **4.16** Test in Chrome
- [ ] **4.17** Test in Firefox
- [ ] **4.18** Test in Safari (if available)
- [ ] **4.19** Test in Edge (if available)

**✨ Success Criteria**: Everything works smoothly on all devices/browsers

---

## ✅ Phase 5: Build & Deploy Preparation (30 minutes)

### Local Build Test
- [ ] **5.1** Stop dev server (Ctrl+C)
- [ ] **5.2** Run `npm run build`
- [ ] **5.3** Verify build completes without errors
- [ ] **5.4** Run `npm start`
- [ ] **5.5** Test production build at http://localhost:3000
- [ ] **5.6** Verify everything still works

### Pre-Deployment Checklist
- [ ] **5.7** Update `README.md` with your project info
- [ ] **5.8** Add `.env.local` to `.gitignore` (already done)
- [ ] **5.9** Remove any test/debug code
- [ ] **5.10** Check no console.log statements in production code
- [ ] **5.11** Verify no API keys in code

### Git Setup
- [ ] **5.12** Initialize Git: `git init`
- [ ] **5.13** Add files: `git add .`
- [ ] **5.14** Commit: `git commit -m "Initial commit"`
- [ ] **5.15** Create GitHub repository
- [ ] **5.16** Push to GitHub:
  ```bash
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```

**✨ Success Criteria**: Production build works, code is in Git

---

## ✅ Phase 6: Deployment (15 minutes)

### Vercel Deployment (Recommended)
- [ ] **6.1** Go to [vercel.com](https://vercel.com)
- [ ] **6.2** Sign up/login with GitHub
- [ ] **6.3** Click "Import Project"
- [ ] **6.4** Select your GitHub repository
- [ ] **6.5** Vercel auto-detects Next.js - click "Deploy"
- [ ] **6.6** Wait for deployment (2-3 minutes)
- [ ] **6.7** Visit your deployed URL
- [ ] **6.8** Test the live site thoroughly

### Post-Deployment
- [ ] **6.9** Set up custom domain (optional)
- [ ] **6.10** Configure environment variables if needed
- [ ] **6.11** Enable analytics (optional)
- [ ] **6.12** Share the URL!

**✨ Success Criteria**: App is live and accessible via public URL

---

## ✅ Phase 7: Advanced (Optional)

### Add Backend
- [ ] **7.1** Choose backend (Supabase, Firebase, etc.)
- [ ] **7.2** Set up database
- [ ] **7.3** Create API routes in `/app/api`
- [ ] **7.4** Connect frontend to backend

### Add Authentication
- [ ] **7.5** Choose auth provider (NextAuth, Clerk)
- [ ] **7.6** Install and configure
- [ ] **7.7** Add login/signup pages
- [ ] **7.8** Protect routes

### Real Data Integration
- [ ] **7.9** Identify energy data source
- [ ] **7.10** Create API integration
- [ ] **7.11** Replace mock data
- [ ] **7.12** Test with real data

### AI Integration
- [ ] **7.13** Choose AI service (OpenAI, etc.)
- [ ] **7.14** Create prediction algorithm
- [ ] **7.15** Replace mock predictions
- [ ] **7.16** Train on user feedback

**✨ Success Criteria**: App has real functionality beyond prototype

---

## 📊 Progress Tracker

Mark your completion:

- [ ] ✅ Phase 1: Initial Setup - **COMPLETE**
- [ ] ✅ Phase 2: Basic Customization - **COMPLETE**
- [ ] ✅ Phase 3: Content Customization - **COMPLETE**
- [ ] ✅ Phase 4: Testing - **COMPLETE**
- [ ] ✅ Phase 5: Build & Deploy Prep - **COMPLETE**
- [ ] ✅ Phase 6: Deployment - **COMPLETE**
- [ ] ✅ Phase 7: Advanced - **COMPLETE**

## 🎯 Quick Reference

| Task | File to Edit |
|------|-------------|
| Change logo | `/components/AppSidebar.tsx` + `/public/images/` |
| Energy rate | `/components/UsagePage.tsx` line ~76 |
| Device list | `/types/index.ts` |
| Insights text | `/components/UsagePage.tsx` + `/components/DeviceInsightCard.tsx` |
| Colors | `/app/globals.css` or Tailwind classes |
| Add pages | Create in `/app/` |

## 🆘 Troubleshooting

### Issue: npm install fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails
**Solution**: Check terminal for error message, usually a TypeScript error

### Issue: Deployment fails
**Solution**: Ensure `npm run build` works locally first

### Issue: Changes not showing
**Solution**: Hard refresh browser (Ctrl+Shift+R) or restart dev server

## 📚 Resources

- **Quick Start**: `QUICKSTART.md`
- **Full Setup**: `SETUP_INSTRUCTIONS.md`
- **Deployment**: `DEPLOYMENT.md`
- **Structure**: `FILE_STRUCTURE.md`
- **Summary**: `EXPORT_SUMMARY.md`

## ✨ Completion

Once you've checked all boxes in Phases 1-6, you have:
- ✅ Working local development environment
- ✅ Customized branding and content
- ✅ Tested functionality
- ✅ Live production deployment

**Congratulations! Your energy dashboard is live! 🎉**

---

*Estimated total time: 3-4 hours from start to deployed*
