'use client';

import { useState } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { UsagePage } from '../components/UsagePage';
import { DevicesPage } from '../components/DevicesPage';
import type { Page, DisplayMode } from '../types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('usage');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('kwh');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([
    'washing-machine',
    'ev-car',
    'dishwasher',
    'fridge',
    'tv',
  ]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1">
          {currentPage === 'usage' && (
            <UsagePage
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              selectedDevices={selectedDevices}
            />
          )}
          {currentPage === 'devices' && (
            <DevicesPage
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}