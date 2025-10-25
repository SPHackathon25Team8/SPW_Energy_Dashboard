'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { availableDevices } from '../types';
import { DeviceUsageConfirmation } from './DeviceBreakdown';
import { DeviceConfirmDialog } from './DeviceConfirmDialog';

// Mock data for device usage by time slot
const generateDayData = (selectedDevices: string[]) => {
  const timeSlots = ['12AM', '2AM', '4AM', '6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];
  return timeSlots.map((time) => {
    const data: any = { time };
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
  return days.map((day) => {
    const data: any = { time: day };
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
  return weeks.map((week) => {
    const data: any = { time: week };
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
}

export function DeviceBreakdownChart({ filter, selectedDevices, confirmations, onUpdateConfirmation }: DeviceBreakdownChartProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [clickedData, setClickedData] = useState<any>(null);

  const data = 
    filter === 'day' ? generateDayData(selectedDevices) :
    filter === 'week' ? generateWeekData(selectedDevices) :
    generateMonthData(selectedDevices);

  const handleBarClick = (data: any, index: number) => {
    setSelectedTimeSlot(data.time);
    setClickedData(data);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis 
              stroke="#64748b" 
              tick={{ fontSize: 12 }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              formatter={(value: number, name: string) => {
                const device = availableDevices.find((d) => d.id === name);
                return [
                  `${value} kWh`,
                  device ? `${device.icon} ${device.name}` : name
                ];
              }}
            />
            <Legend 
              formatter={(value: string) => {
                const device = availableDevices.find((d) => d.id === value);
                return device ? `${device.icon} ${device.name}` : value;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
            {selectedDevices.map((deviceId, index) => (
              <Bar 
                key={deviceId} 
                dataKey={deviceId} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]}
                onClick={handleBarClick}
                cursor="pointer"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-500 mt-2 text-center">
        Click on any bar to confirm or adjust device usage predictions
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