'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { availableDevices } from '../types';
import { DeviceBreakdownChart } from './DeviceBreakdownChart';
import { DeviceInsightCard } from './DeviceInsightCard';
import { Lightbulb } from 'lucide-react';

type TimeFilter = 'day' | 'week' | 'month';

export interface DeviceUsageConfirmation {
  timeSlot: string;
  devices: {
    [deviceId: string]: boolean; // true = in use, false = not in use
  };
}

interface DeviceBreakdownProps {
  selectedDevices: string[];
}

export function DeviceBreakdown({ selectedDevices }: DeviceBreakdownProps) {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('day');
  const [confirmations, setConfirmations] = useState<DeviceUsageConfirmation[]>([]);

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
      <Card className="shadow-md">
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'day' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('day')}
              className="flex-1"
            >
              Day
            </Button>
            <Button
              variant={selectedFilter === 'week' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('week')}
              className="flex-1"
            >
              Week
            </Button>
            <Button
              variant={selectedFilter === 'month' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('month')}
              className="flex-1"
            >
              Month
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Device Energy Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <DeviceBreakdownChart
            filter={selectedFilter}
            selectedDevices={selectedDevices}
            confirmations={confirmations}
            onUpdateConfirmation={updateConfirmation}
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