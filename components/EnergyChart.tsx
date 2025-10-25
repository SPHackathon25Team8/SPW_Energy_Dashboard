'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DisplayMode } from '../types';
import { availableDevices } from '../types';
import { AlertCircle } from 'lucide-react';

const dayData = [
  { time: '12AM', usage: 1.2, devices: ['fridge', 'tv'] },
  { time: '2AM', usage: 0.8, devices: ['fridge'] },
  { time: '4AM', usage: 0.9, devices: ['fridge'] },
  { time: '6AM', usage: 1.5, devices: ['fridge', 'kettle'] },
  { time: '8AM', usage: 2.3, devices: ['fridge', 'washing-machine', 'tv'] },
  { time: '10AM', usage: 1.8, devices: ['fridge', 'dishwasher'] },
  { time: '12PM', usage: 2.1, devices: ['fridge', 'oven', 'tv'] },
  { time: '2PM', usage: 2.5, devices: ['fridge', 'dryer', 'computer'] },
  { time: '4PM', usage: 2.2, devices: ['fridge', 'tv', 'computer'] },
  { time: '6PM', usage: 3.8, devices: ['fridge', 'oven', 'tv', 'dishwasher'] },
  { time: '8PM', usage: 3.4, devices: ['fridge', 'tv', 'washing-machine', 'ev-car'] },
  { time: '10PM', usage: 2.1, devices: ['fridge', 'tv'] },
];

const weekData = [
  { day: 'Mon', usage: 22.5, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven'] },
  { day: 'Tue', usage: 19.8, devices: ['fridge', 'dishwasher', 'tv', 'oven'] },
  { day: 'Wed', usage: 20.2, devices: ['fridge', 'washing-machine', 'tv', 'oven'] },
  { day: 'Thu', usage: 24.1, devices: ['fridge', 'dishwasher', 'tv', 'oven', 'dryer'] },
  { day: 'Fri', usage: 26.3, devices: ['fridge', 'washing-machine', 'tv', 'oven', 'ev-car'] },
  { day: 'Sat', usage: 35.8, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'] },
  { day: 'Sun', usage: 37.7, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car', 'ac'] },
];

const monthData = [
  { week: 'Week 1', usage: 168, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car'] },
  { week: 'Week 2', usage: 195, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'] },
  { week: 'Week 3', usage: 152, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car'] },
  { week: 'Week 4', usage: 227.6, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'] },
];

interface EnergyChartProps {
  filter: 'day' | 'week' | 'month';
  displayMode: DisplayMode;
  selectedDevices: string[];
  onPeakClick?: (timeSlot: string, data: any) => void;
}

const CustomTooltip = ({ active, payload, displayMode, selectedDevices }: any) => {
  if (active && payload && payload.length) {
    const costPerKwh = 0.24;
    const usage = payload[0].value;
    const devices = payload[0].payload.devices || [];
    
    // Filter devices to only show selected ones
    const activeDevices = devices.filter((deviceId: string) => 
      selectedDevices.includes(deviceId)
    );
    
    const displayValue = displayMode === 'kwh' 
      ? `${usage} kWh`
      : `£${(usage * costPerKwh).toFixed(2)}`;

    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-slate-900 mb-2">{displayValue}</p>
        {activeDevices.length > 0 && (
          <div className="border-t border-slate-200 pt-2 mt-2">
            <p className="text-xs text-slate-500 mb-1">Predicted devices:</p>
            <div className="flex flex-wrap gap-1">
              {activeDevices.map((deviceId: string) => {
                const device = availableDevices.find((d) => d.id === deviceId);
                return device ? (
                  <span
                    key={deviceId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    <span>{device.icon}</span>
                    <span>{device.name}</span>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export function EnergyChart({ filter, displayMode, selectedDevices, onPeakClick }: EnergyChartProps) {
  const data = filter === 'day' ? dayData : filter === 'week' ? weekData : monthData;
  const dataKey = filter === 'day' ? 'time' : filter === 'week' ? 'day' : 'week';

  // Detect peaks - usage > 80% of max
  const maxUsage = Math.max(...data.map(d => d.usage));
  const peakThreshold = maxUsage * 0.8;
  const peaks = data.filter(d => d.usage >= peakThreshold);

  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey={dataKey} 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fontSize: 12 }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip 
            content={<CustomTooltip displayMode={displayMode} selectedDevices={selectedDevices} />}
          />
          <Area 
            type="monotone" 
            dataKey="usage" 
            stroke="#16a34a" 
            strokeWidth={3}
            fill="url(#colorUsage)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Peak indicators */}
      {onPeakClick && peaks.map((peak, index) => {
        const dataIndex = data.indexOf(peak);
        const totalPoints = data.length;
        // Calculate position based on index
        const leftPosition = ((dataIndex / (totalPoints - 1)) * 85) + 7.5; // Adjust for margins
        const topPosition = ((maxUsage - peak.usage) / maxUsage) * 70 + 5; // Adjust based on value
        
        return (
          <div
            key={index}
            className="absolute cursor-pointer group"
            style={{
              left: `${leftPosition}%`,
              top: `${topPosition}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => onPeakClick(peak[dataKey], peak)}
          >
            <div className="relative">
              <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse drop-shadow-lg" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Click to review
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}