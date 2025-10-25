import { Card, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import type { Device } from '../types';

interface DeviceInsightCardProps {
  device: Device;
  filter: 'day' | 'week' | 'month';
}

// Mock insights for different devices
const deviceInsights: { [key: string]: { [key: string]: { title: string; description: string; trend: 'up' | 'down' | 'neutral' } } } = {
  'washing-machine': {
    day: { title: '1 Cycle Today', description: 'Used during morning hours. Consider using eco mode to save 20% energy.', trend: 'neutral' },
    week: { title: '3 Cycles This Week', description: 'Usage is normal. Running full loads saved you approximately £1.20.', trend: 'down' },
    month: { title: '14% Below Average', description: 'Great! You\'re using your washing machine less frequently this month.', trend: 'down' },
  },
  'ev-car': {
    day: { title: 'Charged 7.2 kWh', description: 'Evening charging detected. Consider off-peak hours (12AM-6AM) for 40% cheaper rates.', trend: 'neutral' },
    week: { title: 'Heavy Usage Weekend', description: 'Weekend charging was 60% higher. This is typical for weekend trips.', trend: 'up' },
    month: { title: 'Consistent Charging Pattern', description: 'Your EV consumed 156 kWh this month, costing £37.44. Well-optimized!', trend: 'neutral' },
  },
  'dishwasher': {
    day: { title: '2 Cycles Detected', description: 'Running at full capacity saves energy. Consider consolidating to 1 daily cycle.', trend: 'neutral' },
    week: { title: '12 Cycles This Week', description: 'Slightly above average. Ensure each load is full to maximize efficiency.', trend: 'up' },
    month: { title: '8% More Efficient', description: 'Your dishwasher is performing better than last month. Keep it up!', trend: 'down' },
  },
  'fridge': {
    day: { title: 'Stable Performance', description: 'Your fridge consumed 2.4 kWh today. Check door seals to maintain efficiency.', trend: 'neutral' },
    week: { title: 'Normal Operation', description: 'Weekly consumption is within expected range. Temperature setting is optimal.', trend: 'neutral' },
    month: { title: 'Efficient All Month', description: 'No spikes detected. Your fridge is running at peak efficiency.', trend: 'down' },
  },
  'oven': {
    day: { title: '2 Hours Usage', description: 'Peak usage at dinner time. Batch cooking could reduce energy by 30%.', trend: 'neutral' },
    week: { title: 'Above Average Use', description: 'Oven was used 18% more this week. Consider using a microwave for reheating.', trend: 'up' },
    month: { title: 'High Energy Consumer', description: 'Your oven used 78 kWh this month. Air fryers can be 50% more efficient.', trend: 'up' },
  },
  'tv': {
    day: { title: '4 Hours Screen Time', description: 'Evening entertainment detected. Enable power-saving mode for 15% reduction.', trend: 'neutral' },
    week: { title: 'Typical Viewing', description: 'Weekly usage is normal. Remember to turn off when not actively watching.', trend: 'neutral' },
    month: { title: '5% Reduction', description: 'You watched less TV this month, saving £1.20 on your energy bill.', trend: 'down' },
  },
  'dryer': {
    day: { title: '1 Cycle Completed', description: 'Consider air-drying when possible to save up to £0.50 per cycle.', trend: 'neutral' },
    week: { title: 'Heavy Drying Week', description: 'Used 5 times this week. Weather permitting, outdoor drying saves significant energy.', trend: 'up' },
    month: { title: 'Winter Usage Pattern', description: 'Dryer usage increased 25% due to weather. This is seasonal and expected.', trend: 'neutral' },
  },
  'computer': {
    day: { title: '6 Hours Active', description: 'Work from home detected. Enable sleep mode during breaks.', trend: 'neutral' },
    week: { title: 'Consistent Usage', description: 'Daily average of 5.5 hours. Power settings are optimized.', trend: 'neutral' },
    month: { title: 'Efficient Computing', description: 'Your setup consumed 18 kWh this month. Well within efficient range.', trend: 'down' },
  },
  'ac': {
    day: { title: '3 Hours Cooling', description: 'Set to 24°C. Each degree higher saves 5% energy.', trend: 'neutral' },
    week: { title: 'Heat Wave Detected', description: 'AC usage 40% higher due to temperatures. Consider using fans to supplement.', trend: 'up' },
    month: { title: 'Summer Peak', description: 'Your AC consumed 105 kWh. Cleaning filters improved efficiency by 12%.', trend: 'neutral' },
  },
  'kettle': {
    day: { title: '5 Boils Today', description: 'Only boil the water you need to save energy on each use.', trend: 'neutral' },
    week: { title: 'Tea & Coffee Lover', description: 'Used 32 times this week. Boiling exact amounts could save £0.80/week.', trend: 'neutral' },
    month: { title: 'Efficient Habit', description: 'Your kettle usage is optimized. Keep boiling only what you need!', trend: 'down' },
  },
};

export function DeviceInsightCard({ device, filter }: DeviceInsightCardProps) {
  const insight = deviceInsights[device.id]?.[filter] || {
    title: 'No insights available',
    description: 'Keep using this device and we\'ll provide personalized insights soon.',
    trend: 'neutral' as const,
  };

  const Icon = insight.trend === 'up' ? TrendingUp : insight.trend === 'down' ? TrendingDown : AlertCircle;
  
  const trendColors = {
    up: 'bg-orange-50 border-orange-200',
    down: 'bg-green-50 border-green-200',
    neutral: 'bg-blue-50 border-blue-200',
  };

  const iconColors = {
    up: 'text-orange-600',
    down: 'text-green-600',
    neutral: 'text-blue-600',
  };

  return (
    <Card className={`${trendColors[insight.trend]} border shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <span className="text-2xl mt-0.5">{device.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-900">{device.name}</h3>
              <Icon className={`w-4 h-4 ${iconColors[insight.trend]}`} />
            </div>
            <h4 className="text-sm text-slate-700 mb-1">{insight.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}