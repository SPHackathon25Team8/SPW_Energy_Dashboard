'use client';

import { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { availableDevices } from '../types';
import { DeviceUsageConfirmation } from './DeviceBreakdown';
import { DeviceConfirmDialog } from './DeviceConfirmDialog';

// Mock data for device usage by time slot
const generateDayData = (selectedDevices: string[]) => {
  const timeSlots = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
  const tariffRates = [8, 8, 8, 8, 24.7, 24.7, 24.7, 24.7, 24.7, 24.7, 24.7, 24.7];
  
  return timeSlots.map((time, index) => {
    const data: any = { time, tariff: tariffRates[index] };
    selectedDevices.forEach((deviceId) => {
      const device = availableDevices.find((d) => d.id === deviceId);
      if (device) {
        // Generate realistic usage patterns
        let usage = 0;
        if (deviceId === 'fridge') usage = Math.random() * 0.3 + 0.1;
        else if (deviceId === 'tv' && ['6PM', '8PM', '10PM'].includes(time)) usage = Math.random() * 0.4 + 0.2;
        else if (deviceId === 'washing-machine' && time === '8AM') usage = Math.random() * 2 + 1.5;
        else if (deviceId === 'dishwasher' && ['10AM', '6PM'].includes(time)) usage = Math.random() * 1.5 + 1;
        else if (deviceId === 'ev-car' && time === '8PM') usage = Math.random() * 7 + 5;
        else if (deviceId === 'oven' && ['12PM', '6PM'].includes(time)) usage = Math.random() * 2 + 1.5;
        else if (deviceId === 'dryer' && time === '2PM') usage = Math.random() * 2 + 1.5;
        else if (['computer', 'kettle'].includes(deviceId) && ['8AM', '2PM', '6PM'].includes(time)) {
          usage = Math.random() * 0.5 + 0.2;
        }
        data[deviceId] = parseFloat(usage.toFixed(2));
      }
    });
    return data;
  });
};

const generateWeekData = (selectedDevices: string[]) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const tariffRates = [24.7, 24.7, 24.7, 24.7, 24.7, 8, 8];
  
  return days.map((day, index) => {
    const data: any = { time: day, tariff: tariffRates[index] };
    selectedDevices.forEach((deviceId) => {
      const device = availableDevices.find((d) => d.id === deviceId);
      if (device) {
        let usage = 0;
        if (deviceId === 'fridge') usage = Math.random() * 3 + 2;
        else if (deviceId === 'tv') usage = Math.random() * 5 + 3;
        else if (deviceId === 'washing-machine' && ['Sat', 'Sun'].includes(day)) usage = Math.random() * 4 + 2;
        else if (deviceId === 'dishwasher') usage = Math.random() * 3 + 1.5;
        else if (deviceId === 'ev-car' && ['Fri', 'Sat', 'Sun'].includes(day)) usage = Math.random() * 15 + 10;
        else if (deviceId === 'oven') usage = Math.random() * 4 + 2;
        else if (deviceId === 'dryer' && ['Sat', 'Sun'].includes(day)) usage = Math.random() * 3 + 2;
        else if (['computer', 'kettle', 'ac'].includes(deviceId)) usage = Math.random() * 2 + 1;
        data[deviceId] = parseFloat(usage.toFixed(2));
      }
    });
    return data;
  });
};

const generateMonthData = (selectedDevices: string[]) => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const tariffRates = [24.7, 8, 24.7, 8];
  
  return weeks.map((week, index) => {
    const data: any = { time: week, tariff: tariffRates[index] };
    selectedDevices.forEach((deviceId) => {
      const device = availableDevices.find((d) => d.id === deviceId);
      if (device) {
        let usage = 0;
        if (deviceId === 'fridge') usage = Math.random() * 20 + 15;
        else if (deviceId === 'tv') usage = Math.random() * 30 + 20;
        else if (deviceId === 'washing-machine') usage = Math.random() * 15 + 10;
        else if (deviceId === 'dishwasher') usage = Math.random() * 15 + 8;
        else if (deviceId === 'ev-car') usage = Math.random() * 60 + 40;
        else if (deviceId === 'oven') usage = Math.random() * 25 + 15;
        else if (deviceId === 'dryer') usage = Math.random() * 12 + 8;
        else if (['computer', 'kettle', 'ac'].includes(deviceId)) usage = Math.random() * 10 + 5;
        data[deviceId] = parseFloat(usage.toFixed(2));
      }
    });
    return data;
  });
};

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

interface DeviceBreakdownChartProps {
  filter: 'day' | 'week' | 'month';
  selectedDevices: string[];
  confirmations: DeviceUsageConfirmation[];
  onUpdateConfirmation: (timeSlot: string, deviceId: string, inUse: boolean) => void;
  displayMode: 'kwh' | 'cost';
  costPerKwh: number;
  showTariff?: boolean;
}

export function DeviceBreakdownChart({ filter, selectedDevices, confirmations, onUpdateConfirmation, displayMode, costPerKwh, showTariff = false }: DeviceBreakdownChartProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [clickedData, setClickedData] = useState<any>(null);

  const getDisplayValue = (kwh: number) => {
    if (displayMode === 'kwh') {
      return `${kwh.toFixed(2)} kWh`;
    } else {
      const cost = (kwh * costPerKwh).toFixed(2);
      return `£${cost}`;
    }
  };

  const data = 
    filter === 'day' ? generateDayData(selectedDevices) :
    filter === 'week' ? generateWeekData(selectedDevices) :
    generateMonthData(selectedDevices);

  // Calculate total usage for each time slot
  const dataWithTotals = data.map(item => {
    const total = selectedDevices.reduce((sum, deviceId) => sum + (item[deviceId] || 0), 0);
    return { ...item, totalUsage: total };
  });

  // Calculate max tariff for Y-axis
  const maxTariff = Math.max(...dataWithTotals.map(d => d.tariff || 0));

  const handleBarClick = (data: any, index: number) => {
    setSelectedTimeSlot(data.time);
    setClickedData(data);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={showTariff ? dataWithTotals : data} margin={{ top: 20, right: showTariff ? 40 : 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
            {showTariff ? (
              <>
                <YAxis 
                  yAxisId="left"
                  stroke="#f59e0b" 
                  tick={{ fontSize: 12 }}
                  domain={[0, Math.ceil(maxTariff * 1.2)]}
                  label={{ 
                    value: 'p/kWh', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fontSize: 12, fill: '#f59e0b' } 
                  }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#16a34a" 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: displayMode === 'kwh' ? 'kWh' : '£', 
                    angle: 90, 
                    position: 'insideRight', 
                    style: { fontSize: 12, fill: '#16a34a' } 
                  }}
                  tickFormatter={(value) => {
                    if (displayMode === 'cost') {
                      return `£${(value * costPerKwh).toFixed(1)}`;
                    }
                    return value;
                  }}
                />
              </>
            ) : (
              <YAxis 
                yAxisId="left"
                stroke="#64748b" 
                tick={{ fontSize: 12 }}
                label={{ 
                  value: displayMode === 'kwh' ? 'kWh' : '£', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fontSize: 12 } 
                }}
                tickFormatter={(value) => {
                  if (displayMode === 'cost') {
                    return `£${(value * costPerKwh).toFixed(1)}`;
                  }
                  return value;
                }}
              />
            )}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'tariff') {
                  return [`${value}p/kWh`, 'Tariff'];
                }
                if (name === 'totalUsage') {
                  const displayValue = displayMode === 'kwh' 
                    ? `${value.toFixed(2)} kWh` 
                    : `£${(value * costPerKwh).toFixed(2)}`;
                  return [displayValue, 'Total Usage'];
                }
                const device = availableDevices.find((d) => d.id === name);
                const displayValue = displayMode === 'kwh' 
                  ? `${value} kWh` 
                  : `£${(value * costPerKwh).toFixed(2)}`;
                return [
                  displayValue,
                  device ? `${device.icon} ${device.name}` : name
                ];
              }}
            />
            <Legend 
              formatter={(value: string) => {
                if (value === 'tariff') return 'Tariff (p/kWh)';
                if (value === 'totalUsage') return `Total ${displayMode === 'kwh' ? '(kWh)' : '(£)'}`;
                const device = availableDevices.find((d) => d.id === value);
                return device ? `${device.icon} ${device.name}` : value;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
            {showTariff ? (
              <>
                <Bar 
                  yAxisId="left"
                  dataKey="tariff" 
                  fill="#fbbf24"
                  fillOpacity={0.6}
                  name="tariff"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalUsage"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 4 }}
                  name="totalUsage"
                />
              </>
            ) : (
              selectedDevices.map((deviceId, index) => (
                <Bar 
                  key={deviceId}
                  yAxisId="left"
                  dataKey={deviceId} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]}
                  onClick={handleBarClick}
                  cursor="pointer"
                />
              ))
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-2 text-center">
        {showTariff 
          ? 'Tariff bars show pricing rates with total consumption overlaid as a line'
          : 'Click on any bar to confirm or adjust device usage predictions'
        }
      </p>

      {selectedTimeSlot && clickedData && (
        <DeviceConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          timeSlot={selectedTimeSlot}
          data={clickedData}
          selectedDevices={selectedDevices}
          confirmations={confirmations}
          onUpdateConfirmation={onUpdateConfirmation}
        />
      )}
    </>
  );
}