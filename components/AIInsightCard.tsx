import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface AIInsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

export function AIInsightCard({ icon: Icon, title, description, trend }: AIInsightCardProps) {
  const trendColors = {
    up: 'bg-red-50 border-red-200',
    down: 'bg-green-50 border-green-200',
    neutral: 'bg-orange-50 border-orange-200',
  };

  const iconColors = {
    up: 'text-red-600',
    down: 'text-green-600',
    neutral: 'text-orange-600',
  };

  return (
    <Card className={`${trendColors[trend]} border shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className={`${iconColors[trend]} mt-0.5`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}