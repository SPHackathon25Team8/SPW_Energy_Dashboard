import { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import { UsagePage } from './components/UsagePage';
import { DevicesPage } from './components/DevicesPage';
import type { Page, DisplayMode } from './types';

const availableDevices = [
  { id: 'washing-machine', name: 'Washing Machine', icon: 'washing-machine', avgPower: 2000, imageUrl: 'https://images.unsplash.com/photo-1754732693535-7ffb5e1a51d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXNoaW5nJTIwbWFjaGluZSUyMGFwcGxpYW5jZXxlbnwxfHx8fDE3NjEzMzMzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'ev-car', name: 'EV Car Charger', icon: 'car', avgPower: 7000, imageUrl: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc2MTMyMjUzNnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'dishwasher', name: 'Dishwasher', icon: 'dishwasher', avgPower: 1800, imageUrl: 'https://images.unsplash.com/photo-1758631130778-42d518bf13aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNod2FzaGVyJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc2MTM4MjExOHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'fridge', name: 'Fridge/Freezer', icon: 'refrigerator', avgPower: 150, imageUrl: 'https://images.unsplash.com/photo-1649518755041-651c29b56309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyaWdlcmF0b3IlMjBmcmlkZ2V8ZW58MXx8fHwxNzYxMzg3MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'oven', name: 'Electric Oven', icon: 'oven', avgPower: 3000, imageUrl: 'https://images.unsplash.com/photo-1722888879060-ed9d1e88c2c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMG92ZW4lMjBzdG92ZXxlbnwxfHx8fDE3NjEzODcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'tv', name: 'TV', icon: 'tv', avgPower: 200, imageUrl: 'https://images.unsplash.com/photo-1559076590-06ce7a5177a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxldmlzaW9uJTIwc2NyZWVufGVufDF8fHx8MTc2MTM4MTk1OXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'ac', name: 'Air Con', icon: 'air-vent', avgPower: 3500, imageUrl: 'https://images.unsplash.com/photo-1647022528152-52ed9338611d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBjb25kaXRpb25pbmclMjB1bml0fGVufDF8fHx8MTc2MTM4NzE5NHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'kettle', name: 'Kettle', icon: 'coffee', avgPower: 2200, imageUrl: 'https://images.unsplash.com/photo-1643114786355-ff9e52736eab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGtldHRsZXxlbnwxfHx8fDE3NjEzNzc1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'dryer', name: 'Dryer', icon: 'dryer', avgPower: 2500, imageUrl: 'https://images.unsplash.com/photo-1637795065412-eed4c565db78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW1ibGUlMjBkcnllcnxlbnwxfHx8fDE3NjEzODcxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'computer', name: 'Computer', icon: 'laptop', avgPower: 400, imageUrl: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjEzNDA1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'heater', name: 'Heater', icon: 'heater', avgPower: 2000, imageUrl: 'https://images.unsplash.com/photo-1740847262528-a29f09775256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGhlYXRlcnxlbnwxfHx8fDE3NjEzODcxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'microwave', name: 'Microwave', icon: 'microwave', avgPower: 1200, imageUrl: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjBvdmVufGVufDF8fHx8MTc2MTMwMjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'vacuum', name: 'Vacuum', icon: 'wind', avgPower: 1400, imageUrl: 'https://images.unsplash.com/photo-1722710070534-e31f0290d8de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBjbGVhbmVyfGVufDF8fHx8MTc2MTMxMTgwMHww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'fan', name: 'Fan', icon: 'fan', avgPower: 75, imageUrl: 'https://images.unsplash.com/photo-1718815416565-c65944a5ec14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGZhbnxlbnwxfHx8fDE3NjEzODcxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'lights', name: 'Lighting', icon: 'lightbulb', avgPower: 100, imageUrl: 'https://images.unsplash.com/photo-1642741406281-81cc3ca9d739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMGJ1bGIlMjBsaWdodGluZ3xlbnwxfHx8fDE3NjEzODcxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'phone', name: 'Chargers', icon: 'smartphone', avgPower: 20, imageUrl: 'https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNoYXJnZXIlMjBjYWJsZXxlbnwxfHx8fDE3NjEzODcxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export default function App() {
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
      <div className="bg-white flex min-h-screen w-full">
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
