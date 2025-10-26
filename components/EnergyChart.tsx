'use client';

import { useState, useEffect } from 'react';
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DisplayMode } from '../types';
import { availableDevices } from '../types';
import { AlertCircle } from 'lucide-react';

// Fallback data in case API fails
const fallbackDayData = [
  { time: '12AM', usage: 1.2, devices: ['fridge', 'tv'], tariff: 8 },
  { time: '2AM', usage: 0.8, devices: ['fridge'], tariff: 8 },
  { time: '4AM', usage: 0.9, devices: ['fridge'], tariff: 8 },
  { time: '6AM', usage: 1.5, devices: ['fridge', 'kettle'], tariff: 8 },
  { time: '8AM', usage: 2.3, devices: ['fridge', 'washing-machine', 'tv'], tariff: 24.7 },
  { time: '10AM', usage: 1.8, devices: ['fridge', 'dishwasher'], tariff: 24.7 },
  { time: '12PM', usage: 2.1, devices: ['fridge', 'oven', 'tv'], tariff: 24.7 },
  { time: '2PM', usage: 2.5, devices: ['fridge', 'dryer', 'computer'], tariff: 24.7 },
  { time: '4PM', usage: 2.2, devices: ['fridge', 'tv', 'computer'], tariff: 24.7 },
  { time: '6PM', usage: 3.8, devices: ['fridge', 'oven', 'tv', 'dishwasher'], tariff: 24.7 },
  { time: '8PM', usage: 3.4, devices: ['fridge', 'tv', 'washing-machine', 'ev-car'], tariff: 24.7 },
  { time: '10PM', usage: 2.1, devices: ['fridge', 'tv'], tariff: 24.7 },
];

const fallbackWeekData = [
  { day: 'Mon', usage: 22.5, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven'], tariff: 24.7 },
  { day: 'Tue', usage: 19.8, devices: ['fridge', 'dishwasher', 'tv', 'oven'], tariff: 24.7 },
  { day: 'Wed', usage: 20.2, devices: ['fridge', 'washing-machine', 'tv', 'oven'], tariff: 24.7 },
  { day: 'Thu', usage: 24.1, devices: ['fridge', 'dishwasher', 'tv', 'oven', 'dryer'], tariff: 24.7 },
  { day: 'Fri', usage: 26.3, devices: ['fridge', 'washing-machine', 'tv', 'oven', 'ev-car'], tariff: 24.7 },
  { day: 'Sat', usage: 35.8, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'], tariff: 8 },
  { day: 'Sun', usage: 37.7, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car', 'ac'], tariff: 8 },
];

const fallbackMonthData = [
  { week: 'Week 1', usage: 168, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car'], tariff: 24.7 },
  { week: 'Week 2', usage: 195, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'], tariff: 8 },
  { week: 'Week 3', usage: 152, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'ev-car'], tariff: 24.7 },
  { week: 'Week 4', usage: 227.6, devices: ['fridge', 'washing-machine', 'dishwasher', 'tv', 'oven', 'dryer', 'ev-car', 'ac'], tariff: 8 },
];

interface EnergyChartProps {
  filter: 'day' | 'week' | 'month';
  displayMode: DisplayMode;
  selectedDevices: string[];
  onPeakClick?: (timeSlot: string, data: any) => void;
  showTariff?: boolean;
}

const CustomTooltip = ({ active, payload, displayMode, selectedDevices, showTariff }: any) => {
  if (active && payload && payload.length) {
    const costPerKwh = 0.24;
    const usage = payload[0].value;
    const devices = payload[0].payload.devices || [];
    const tariff = payload[0].payload.tariff;

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
        {showTariff && tariff && (
          <p className="text-xs text-amber-600 mb-2">
            Tariff: <span className="font-semibold">{tariff}p/kWh</span>
          </p>
        )}
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

export function EnergyChart({ filter, displayMode, selectedDevices, onPeakClick, showTariff = false }: EnergyChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataKey = filter === 'day' ? 'time' : filter === 'week' ? 'day' : 'week';

  // Fetch data from API
  // Expected API response format:
  // GET /day: [{ time: '12AM', usage: 1.2, devices: ['fridge', 'tv'], tariff: 8 }, ...]
  // GET /week: [{ day: 'Mon', usage: 22.5, devices: ['fridge', 'washing-machine'], tariff: 24.7 }, ...]
  // GET /month: [{ week: 'Week 1', usage: 168, devices: ['fridge', 'washing-machine'], tariff: 24.7 }, ...]
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = `/api/proxy/${filter}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${filter} data: ${response.statusText}`);
        }

        const apiData = await response.json();
        setData(apiData);
      } catch (err) {
        console.error(`Error fetching ${filter} data:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');

        // Use fallback data
        const fallbackData = filter === 'day' ? fallbackDayData :
          filter === 'week' ? fallbackWeekData :
            fallbackMonthData;
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-slate-500">Loading chart data...</div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-red-500 text-sm text-center">
          <div>Failed to load data from API</div>
          <div className="text-xs text-slate-500 mt-1">Using fallback data</div>
        </div>
      </div>
    );
  }

  // Detect peaks - usage > 80% of max
  const maxUsage = Math.max(...data.map(d => d.usage));
  const peakThreshold = maxUsage * 0.8;
  const peaks = data.filter(d => d.usage >= peakThreshold);

  // Calculate max tariff for Y-axis
  const maxTariff = Math.max(...data.map(d => d.tariff || 0));

  return (
    <div className="w-full h-64 relative">
      {error && (
        <div className="absolute top-2 right-2 z-10 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
          Using offline data
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: showTariff ? 40 : 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey={dataKey}
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />
          {showTariff ? (
            <>
              <YAxis
                yAxisId="left"
                stroke="#f59e0b"
                tick={{ fontSize: 12 }}
                domain={[0, Math.ceil(maxTariff * 1.2)]}
                label={{ value: 'p/kWh', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#f59e0b' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#16a34a"
                tick={{ fontSize: 12 }}
                label={{ value: displayMode === 'kwh' ? 'kWh' : '£', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#16a34a' } }}
              />
            </>
          ) : (
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              label={{ value: displayMode === 'kwh' ? 'kWh' : '£', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
          )}
          <Tooltip
            content={<CustomTooltip displayMode={displayMode} selectedDevices={selectedDevices} showTariff={showTariff} />}
          />
          {showTariff && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {showTariff ? (
            <>
              <Bar
                yAxisId="left"
                dataKey="tariff"
                fill="#fbbf24"
                fillOpacity={0.6}
                name="Tariff (p/kWh)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="usage"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', r: 4 }}
                name={displayMode === 'kwh' ? 'Usage (kWh)' : 'Cost (£)'}
              />
            </>
          ) : (
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="usage"
              stroke="#16a34a"
              strokeWidth={3}
              fill="url(#colorUsage)"
              name={displayMode === 'kwh' ? 'Usage (kWh)' : 'Cost (£)'}
            />
          )}
        </ComposedChart>
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