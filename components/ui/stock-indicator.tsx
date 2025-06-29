"use client";

import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StockIndicatorProps {
  quantity: number;
  lowStockThreshold?: number;
}

export function StockIndicator({ quantity, lowStockThreshold = 10 }: StockIndicatorProps) {
  const getStockStatus = () => {
    if (quantity === 0) {
      return {
        status: 'out-of-stock',
        label: 'Out of Stock',
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    } else if (quantity <= lowStockThreshold) {
      return {
        status: 'low-stock',
        label: `Only ${quantity} left`,
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    } else {
      return {
        status: 'in-stock',
        label: 'In Stock',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    }
  };

  const stockInfo = getStockStatus();
  const Icon = stockInfo.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 p-3 rounded-lg border",
      stockInfo.bgColor,
      stockInfo.borderColor
    )}>
      <Icon className={cn("h-4 w-4", stockInfo.color)} />
      <span className={cn("font-medium text-sm", stockInfo.color)}>
        {stockInfo.label}
      </span>
      {quantity > 0 && quantity <= lowStockThreshold && (
        <Badge variant="outline" className="ml-auto text-xs">
          Hurry!
        </Badge>
      )}
    </div>
  );
}