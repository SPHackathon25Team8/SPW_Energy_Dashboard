'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Zap, TrendingDown, TrendingUp, Lightbulb, Calendar, BadgePoundSterling } from 'lucide-react';
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

// Fallback insights in case API fails
const fallbackInsights: Record<TimeFilter, InsightData[]> = {
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
  const [showTariff, setShowTariff] = useState(false);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // Energy cost calculation (£0.24 per kWh - UK average)
  const costPerKwh = 0.24;

  // Map icon names to components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'TrendingDown': TrendingDown,
      'TrendingUp': TrendingUp,
      'Lightbulb': Lightbulb,
      'Calendar': Calendar,
    };
    return iconMap[iconName] || Lightbulb;
  };

  // Fetch AI insights from API
  // Expected API response format:
  // GET /aiinsights?period=day: [{ title: 'Peak Usage', description: '...', trend: 'up', iconName: 'TrendingUp' }, ...]
  useEffect(() => {
    const fetchInsights = async () => {
      setInsightsLoading(true);
      setInsightsError(null);
      
      try {
        const response = await fetch(`/api/proxy/aiinsights?period=${selectedFilter}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch insights: ${response.statusText}`);
        }
        
        const apiInsights = await response.json();
        
        // Transform API data to match our interface
        const transformedInsights = apiInsights.map((insight: any) => ({
          ...insight,
          icon: getIconComponent(insight.iconName || 'Lightbulb'),
        }));
        
        setInsights(transformedInsights);
      } catch (err) {
        console.error(`Error fetching insights for ${selectedFilter}:`, err);
        setInsightsError(err instanceof Error ? err.message : 'Failed to fetch insights');
        
        // Use fallback data
        setInsights(fallbackInsights[selectedFilter]);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();
  }, [selectedFilter]);
  
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
        <Card className="bg-white border-slate-200 mb-4 shadow-md">
          <CardContent className="p-3">
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'day' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('day')}
                className={`flex-1 ${
                  selectedFilter === 'day' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Day
              </Button>
              <Button
                variant={selectedFilter === 'week' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('week')}
                className={`flex-1 ${
                  selectedFilter === 'week' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Week
              </Button>
              <Button
                variant={selectedFilter === 'month' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('month')}
                className={`flex-1 ${
                  selectedFilter === 'month' 
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
        <Card className="bg-white border-slate-200 mb-4 shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-slate-600 mr-1">Display:</span>
              <Button
                variant={displayMode === 'kwh' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDisplayMode('kwh')}
                className={`flex-1 gap-1.5 ${
                  displayMode === 'kwh' 
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
                className={`flex-1 gap-1.5 ${
                  displayMode === 'cost' 
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
                id="show-tariff"
                checked={showTariff}
                onCheckedChange={(checked) => setShowTariff(checked as boolean)}
              />
              <label
                htmlFor="show-tariff"
                className="text-sm text-slate-700 cursor-pointer select-none"
              >
                Show tariff rates on graph
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Energy Chart */}
        <Card className="bg-white border-slate-200 mb-4 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Consumption</span>
              <span className="text-green-600">
                {selectedFilter === 'day' && getDisplayValue(24.8)}
                {selectedFilter === 'week' && getDisplayValue(186.4)}
                {selectedFilter === 'month' && getDisplayValue(742.6)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnergyChart 
              filter={selectedFilter} 
              displayMode={displayMode}
              selectedDevices={selectedDevices}
              onPeakClick={handlePeakClick}
              showTariff={showTariff}
            />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-slate-700">AI Insights</h2>
          </div>
          
          {insightsLoading ? (
            <div className="text-center py-4 text-slate-500">
              Loading insights...
            </div>
          ) : insightsError ? (
            <div className="text-center py-4 text-red-500 text-sm">
              {insightsError}
            </div>
          ) : (
            insights.map((insight, index) => (
              <AIInsightCard key={index} {...insight} />
            ))
          )}
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