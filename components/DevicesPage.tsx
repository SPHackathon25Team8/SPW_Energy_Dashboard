'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Zap } from 'lucide-react';
import { availableDevices } from '../types';
import { SidebarTrigger } from './ui/sidebar';
import { DeviceBreakdown } from './DeviceBreakdown';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DevicesPageProps {
  selectedDevices: string[];
  setSelectedDevices: (devices: string[]) => void;
}

export function DevicesPage({ selectedDevices, setSelectedDevices }: DevicesPageProps) {
  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter((id) => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 pt-8 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <SidebarTrigger className="text-white hover:bg-white/20 lg:hidden" />
          <div className="bg-white/20 p-2 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h1>My Devices</h1>
        </div>
        <p className="text-green-100 text-sm">Select devices in your household</p>
      </div>

      <div className="px-4 -mt-4">
        <Tabs defaultValue="selection" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="selection">Device Selection</TabsTrigger>
            <TabsTrigger value="breakdown">Usage Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Household Devices</CardTitle>
                <CardDescription>
                  Select the devices you have. Our AI will predict when they're in use based on energy patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {availableDevices.map((device) => {
                    const isSelected = selectedDevices.includes(device.id);
                    
                    return (
                      <button
                        key={device.id}
                        onClick={() => toggleDevice(device.id)}
                        className={`
                          aspect-square rounded-xl border-3 overflow-hidden flex flex-col
                          transition-all duration-200 cursor-pointer
                          ${isSelected 
                            ? 'border-green-500 shadow-lg shadow-green-500/50 scale-105' 
                            : 'border-slate-300 hover:border-slate-400'
                          }
                        `}
                        style={{ borderWidth: '3px' }}
                      >
                        {/* Title at top */}
                        <div className={`px-2 py-1.5 text-center transition-colors ${
                          isSelected ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <div className="text-xs truncate">
                            {device.name}
                          </div>
                        </div>
                        
                        {/* Image in center */}
                        <div className="flex-1 relative overflow-hidden bg-white">
                          <ImageWithFallback 
                            src={device.imageUrl} 
                            alt={device.name}
                            className={`w-full h-full object-cover transition-all ${
                              isSelected ? '' : 'grayscale opacity-60'
                            }`}
                          />
                        </div>
                        
                        {/* kW at bottom */}
                        <div className={`px-2 py-1 text-center transition-colors ${
                          isSelected ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <div className="text-[10px]">
                            {(device.avgPower / 1000).toFixed(1)} kW
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {selectedDevices.length > 0 && (
              <Card className="mt-4 shadow-md bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-green-800">
                    ✓ {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''} selected. 
                    View the Usage Breakdown tab to see individual device consumption.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="breakdown">
            <DeviceBreakdown selectedDevices={selectedDevices} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}