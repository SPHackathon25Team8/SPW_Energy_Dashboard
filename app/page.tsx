'use client';

import { useState, useEffect } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { UsagePage } from '../components/UsagePage';
import { DevicesPage } from '../components/DevicesPage';
import type { Page, DisplayMode } from '../types';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('usage');
  
  // Initialize displayMode from localStorage or use default
  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('displayMode');
      if (stored && (stored === 'kwh' || stored === 'cost')) {
        return stored as DisplayMode;
      }
    }
    return 'kwh';
  });

  // Wrapper function to persist displayMode to localStorage
  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('displayMode', mode);
    }
  };
  
  // Initialize selectedDevices from localStorage or use defaults
  const [selectedDevices, setSelectedDevicesState] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedDevices');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored devices:', e);
        }
      }
    }
    // Default devices if nothing stored
    return [
      'washing-machine',
      'ev-car',
      'dishwasher',
      'fridge',
      'tv',
    ];
  });

  // Wrapper function to persist to localStorage
  const setSelectedDevices = (devices: string[]) => {
    setSelectedDevicesState(devices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedDevices', JSON.stringify(devices));
    }
  };

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
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}