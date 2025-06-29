"use client";

import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StockIndicatorProps {
  quantity: number;
  lowStockThreshold?: number;
  showProgress?: boolean;
  maxStock?: number;
  className?: string;
}

export function StockIndicator({ 
  quantity, 
  lowStockThreshold = 10, 
  showProgress = false,
  maxStock = 100,
  className 
}: StockIndicatorProps) {
  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity <= lowStockThreshold;
  const isInStock = quantity > lowStockThreshold;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        label: 'Out of Stock',
        color: 'destructive',
        icon: AlertTriangle,
        textColor: 'text-destructive',
      };
    }
    
    if (isLowStock) {
      return {
        label: `Only ${quantity} left`,
        color: 'secondary',
        icon: Package,
        textColor: 'text-orange-600',
      };
    }
    
    return {
      label: 'In Stock',
      color: 'default',
      icon: CheckCircle,
      textColor: 'text-green-600',
    };
  };

  const status = getStockStatus();
  const stockPercentage = Math.min((quantity / maxStock) * 100, 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <status.icon className={cn("h-4 w-4", status.textColor)} />
        <Badge variant={status.color as any} className="text-xs">
          {status.label}
        </Badge>
        {quantity > 0 && (
          <span className="text-sm text-muted-foreground">
            ({quantity} available)
          </span>
        )}
      </div>

      {showProgress && quantity > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Stock Level</span>
            <span>{quantity}/{maxStock}</span>
          </div>
          <Progress 
            value={stockPercentage} 
            className={cn(
              "h-2",
              isLowStock && "bg-orange-100",
              isOutOfStock && "bg-red-100"
            )}
          />
        </div>
      )}

      {isLowStock && (
        <p className="text-xs text-orange-600 font-medium">
          ⚡ Limited stock - order soon!
        </p>
      )}

      {isOutOfStock && (
        <p className="text-xs text-destructive">
          This item is currently out of stock. Check back soon or contact us for availability.
        </p>
      )}
    </div>
  );
}