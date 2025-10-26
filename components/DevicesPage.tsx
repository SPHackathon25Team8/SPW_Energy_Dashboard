'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Zap, 
  WashingMachine, 
  Car, 
  UtensilsCrossed, 
  Refrigerator, 
  CookingPot,
  Tv,
  AirVent,
  Coffee,
  Wind,
  Laptop,
  Flame,
  Microwave,
  Fan,
  Lightbulb,
  Smartphone
} from 'lucide-react';
import { availableDevices, DisplayMode } from '../types';
import { SidebarTrigger } from './ui/sidebar';
import { DeviceBreakdown } from './DeviceBreakdown';
import { useState } from 'react';

interface DevicesPageProps {
  selectedDevices: string[];
  setSelectedDevices: (devices: string[]) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

// Map device icon names to lucide-react components
const iconMap: Record<string, any> = {
  'washing-machine': WashingMachine,
  'car': Car,
  'dishwasher': UtensilsCrossed,
  'refrigerator': Refrigerator,
  'oven': CookingPot,
  'tv': Tv,
  'air-vent': AirVent,
  'coffee': Coffee,
  'dryer': Wind,
  'laptop': Laptop,
  'heater': Flame,
  'microwave': Microwave,
  'wind': Wind,
  'fan': Fan,
  'lightbulb': Lightbulb,
  'smartphone': Smartphone,
};




export function DevicesPage({ selectedDevices, setSelectedDevices, displayMode, setDisplayMode }: DevicesPageProps) {
  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter((id) => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  const [devicesTab, setDevicesTab] = useState("device");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-8 ">
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
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-white border-slate-200 shadow-md">
            <TabsTrigger value="selection" onClick={() => setDevicesTab("device")}
            className={`flex-1 ${
                  devicesTab === 'device' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}            
            >Device Selection</TabsTrigger>
            <TabsTrigger value="breakdown"  onClick={() => setDevicesTab("usage")}
                        className={`flex-1 ${
                  devicesTab === 'usage' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}       
                >Usage Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <Card className="bg-white border-slate-200  shadow-md">
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
                    const IconComponent = iconMap[device.icon] || Zap;
                    
                    return (
                      <button
                        key={device.id}
                        onClick={() => toggleDevice(device.id)}
                        className={`
                          aspect-square rounded-xl border-3 overflow-hidden flex flex-col
                          transition-all duration-200 cursor-pointer
                          ${isSelected 
                            ? 'shadow-lg scale-105' 
                            : 'hover:border-slate-400'
                          }
                        `}
                        style={{ 
                          borderWidth: '3px',
                          borderColor: isSelected ? '#00A651' : '#e2e8f0'
                        }}
                      >
                        {/* Title at top */}
                        <div 
                          className="px-2 py-1.5 text-center transition-colors"
                          style={{
                            backgroundColor: isSelected ? '#00A651' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#334155'
                          }}
                        >
                          <div className="text-xs truncate">
                            {device.name}
                          </div>
                        </div>
                        
                        {/* Sketched Icon in center - 60% of card */}
                        <div className="flex-1 flex items-center justify-center bg-white p-2">
                          <IconComponent 
                            className="transition-all"
                            fill="none"
                            style={{
                              width: '60%',
                              height: '60%',
                              strokeWidth: 1.5,
                              stroke: isSelected ? '#00A651' : '#FF6B35',
                              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                            }}
                          />
                        </div>
                        
                        {/* kW at bottom */}
                        <div 
                          className="px-2 py-1 text-center transition-colors"
                          style={{
                            backgroundColor: isSelected ? '#00A651' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#475569'
                          }}
                        >
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
            <DeviceBreakdown 
              selectedDevices={selectedDevices}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}