'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { availableDevices, DisplayMode } from '../types';
import { DeviceBreakdownChart } from './DeviceBreakdownChart';
import { DeviceInsightCard } from './DeviceInsightCard';
import { Lightbulb, BadgePoundSterling, Zap } from 'lucide-react';

type TimeFilter = 'day' | 'week' | 'month';

export interface DeviceUsageConfirmation {
  timeSlot: string;
  devices: {
    [deviceId: string]: boolean; // true = in use, false = not in use
  };
}

interface DeviceBreakdownProps {
  selectedDevices: string[];
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

export function DeviceBreakdown({ selectedDevices, displayMode, setDisplayMode }: DeviceBreakdownProps) {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('day');
  const [confirmations, setConfirmations] = useState<DeviceUsageConfirmation[]>([]);
  const [showTariff, setShowTariff] = useState(false);

  // Energy cost calculation (£0.24 per kWh - UK average)
  const costPerKwh = 0.24;

  const updateConfirmation = (timeSlot: string, deviceId: string, inUse: boolean) => {
    setConfirmations((prev) => {
      const existing = prev.find((c) => c.timeSlot === timeSlot);
      if (existing) {
        return prev.map((c) =>
          c.timeSlot === timeSlot
            ? { ...c, devices: { ...c.devices, [deviceId]: inUse } }
            : c
        );
      } else {
        return [...prev, { timeSlot, devices: { [deviceId]: inUse } }];
      }
    });
  };

  const userDevices = availableDevices.filter((d) => selectedDevices.includes(d.id));

  if (selectedDevices.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8 text-center">
          <p className="text-slate-500">
            No devices selected. Please add devices in the Device Selection tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <Card className="bg-white border-slate-200 shadow-md">
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'day' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('day')}
              className={`flex-1 ${selectedFilter === 'day'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              Day
            </Button>
            <Button
              variant={selectedFilter === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('week')}
              className={`flex-1 ${selectedFilter === 'week'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              Week
            </Button>
            <Button
              variant={selectedFilter === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('month')}
              className={`flex-1 ${selectedFilter === 'month'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              Month
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Mode Toggle */}
      <Card className="bg-white border-slate-200  shadow-md mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-slate-600 mr-1">Display:</span>
            <Button
              variant={displayMode === 'kwh' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDisplayMode('kwh')}
              className={`flex-1 gap-1.5 ${displayMode === 'kwh'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              <Zap className="w-3.5 h-3.5" />
              kWh
            </Button>
            <Button
              variant={displayMode === 'cost' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDisplayMode('cost')}
              className={`flex-1 gap-1.5 ${displayMode === 'cost'
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
            >
              <BadgePoundSterling className="w-3.5 h-3.5" />
              Cost (£)
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            <Checkbox
              id="show-tariff-device"
              checked={showTariff}
              onCheckedChange={(checked) => setShowTariff(checked as boolean)}
            />
            <label
              htmlFor="show-tariff-device"
              className="text-sm text-slate-700 cursor-pointer select-none"
            >
              Show tariff rates on graph
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown Chart */}
      <Card className="bg-white border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle>Device Energy Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <DeviceBreakdownChart
            filter={selectedFilter}
            selectedDevices={selectedDevices}
            confirmations={confirmations}
            onUpdateConfirmation={updateConfirmation}
            displayMode={displayMode}
            costPerKwh={costPerKwh}
            showTariff={showTariff}
          />
        </CardContent>
      </Card>

      {/* AI Insights for Devices */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-slate-700">Device Insights</h2>
        </div>

        {userDevices.map((device) => (
          <DeviceInsightCard key={device.id} device={device} filter={selectedFilter} />
        ))}
      </div>
    </div>
  );
}