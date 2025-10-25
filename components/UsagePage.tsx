'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Zap, TrendingDown, TrendingUp, Lightbulb, Calendar, BadgePoundSterling, Menu } from 'lucide-react';
import { EnergyChart } from './EnergyChart';
import { AIInsightCard } from './AIInsightCard';
import type { DisplayMode } from '../types';
import { SidebarTrigger } from './ui/sidebar';
import { DeviceConfirmDialog } from './DeviceConfirmDialog';
import { DeviceUsageConfirmation } from './DeviceBreakdown';

type TimeFilter = 'day' | 'week' | 'month';

interface InsightData {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

const insights: Record<TimeFilter, InsightData[]> = {
  day: [
    {
      icon: TrendingDown,
      title: 'Peak Usage: 6-9 PM',
      description: 'Your highest energy consumption occurs during evening hours. Consider shifting laundry and dishwashing to off-peak times.',
      trend: 'neutral',
    },
    {
      icon: Lightbulb,
      title: '15% Below Average',
      description: 'Great work! Your usage today is 15% lower than your typical daily consumption.',
      trend: 'down',
    },
  ],
  week: [
    {
      icon: TrendingUp,
      title: 'Weekend Spike Detected',
      description: 'Energy usage increased by 22% on weekends. Your HVAC system appears to be running more frequently.',
      trend: 'up',
    },
    {
      icon: Lightbulb,
      title: 'Consistent Night Usage',
      description: 'Your baseline consumption between 12-6 AM is stable. No vampire power drains detected.',
      trend: 'neutral',
    },
    {
      icon: TrendingDown,
      title: 'Midweek Efficiency',
      description: 'Tuesday and Wednesday show optimal energy patterns. You saved £2.02 compared to other weekdays.',
      trend: 'down',
    },
  ],
  month: [
    {
      icon: TrendingDown,
      title: '8% Monthly Reduction',
      description: 'This month you reduced consumption by 8% compared to last month. You\'re on track to save £24 annually.',
      trend: 'down',
    },
    {
      icon: Lightbulb,
      title: 'Weather Impact Analysis',
      description: 'Cooler temperatures in week 3 reduced AC usage by 18%. Consider programmable thermostat adjustments.',
      trend: 'neutral',
    },
    {
      icon: Calendar,
      title: 'Billing Cycle Forecast',
      description: 'Based on current trends, your next bill will be approximately £142, down from £156 last month.',
      trend: 'down',
    },
  ],
};

interface UsagePageProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  selectedDevices: string[];
}

export function UsagePage({ displayMode, setDisplayMode, selectedDevices }: UsagePageProps) {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('day');
  const [confirmations, setConfirmations] = useState<DeviceUsageConfirmation[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [clickedData, setClickedData] = useState<any>(null);

  // Energy cost calculation (£0.24 per kWh - UK average)
  const costPerKwh = 0.24;
  
  const getDisplayValue = (kwh: number) => {
    if (displayMode === 'kwh') {
      return `${kwh} kWh`;
    } else {
      const cost = (kwh * costPerKwh).toFixed(2);
      return `£${cost}`;
    }
  };

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

  const handlePeakClick = (timeSlot: string, data: any) => {
    setSelectedTimeSlot(timeSlot);
    setClickedData(data);
    setDialogOpen(true);
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
          <h1>Energy Usage</h1>
        </div>
        <p className="text-green-100 text-sm">Track and optimize your consumption</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Filter Buttons */}
        <Card className="mb-4 shadow-md">
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

        {/* Energy Chart */}
        <Card className="mb-4 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Consumption</span>
              <div className="flex items-center gap-2">
                <span className="text-green-600">
                  {selectedFilter === 'day' && getDisplayValue(24.8)}
                  {selectedFilter === 'week' && getDisplayValue(186.4)}
                  {selectedFilter === 'month' && getDisplayValue(742.6)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDisplayMode(displayMode === 'kwh' ? 'cost' : 'kwh')}
                  className="h-8 w-8 p-0 hover:bg-green-50"
                >
                  {displayMode === 'kwh' ? (
                    <BadgePoundSterling className="w-4 h-4 text-green-600" />
                  ) : (
                    <Zap className="w-4 h-4 text-green-600" />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnergyChart 
              filter={selectedFilter} 
              displayMode={displayMode}
              selectedDevices={selectedDevices}
              onPeakClick={handlePeakClick}
            />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-slate-700">AI Insights</h2>
          </div>
          
          {insights[selectedFilter].map((insight, index) => (
            <AIInsightCard key={index} {...insight} />
          ))}
        </div>
      </div>

      {/* Device Confirmation Dialog */}
      {selectedTimeSlot && clickedData && (
        <DeviceConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          timeSlot={selectedTimeSlot}
          data={clickedData}
          selectedDevices={selectedDevices}
          confirmations={confirmations}
          onUpdateConfirmation={updateConfirmation}
        />
      )}
    </div>
  );
}