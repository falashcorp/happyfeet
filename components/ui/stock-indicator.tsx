"use client";

import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StockIndicatorProps {
  quantity: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockIndicator({ 
  quantity, 
  lowStockThreshold = 10,
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
        description: 'This item is currently unavailable',
      };
    }
    
    if (isLowStock) {
      return {
        label: 'Low Stock',
        color: 'warning',
        icon: Package,
        description: `Only ${quantity} left in stock`,
      };
    }
    
    return {
      label: 'In Stock',
      color: 'success',
      icon: CheckCircle,
      description: `${quantity} available`,
    };
  };

  const status = getStockStatus();
  const Icon = status.icon;

  // Calculate urgency percentage for low stock items
  const urgencyPercentage = isLowStock ? ((lowStockThreshold - quantity) / lowStockThreshold) * 100 : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-4 w-4",
          status.color === 'destructive' && "text-red-500",
          status.color === 'warning' && "text-yellow-500",
          status.color === 'success' && "text-green-500"
        )} />
        <Badge 
          variant={status.color === 'destructive' ? 'destructive' : 'secondary'}
          className={cn(
            status.color === 'warning' && "bg-yellow-100 text-yellow-800 border-yellow-200",
            status.color === 'success' && "bg-green-100 text-green-800 border-green-200"
          )}
        >
          {status.label}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {status.description}
      </p>

      {/* Urgency indicator for low stock */}
      {isLowStock && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Stock Level</span>
            <span>{quantity} remaining</span>
          </div>
          <Progress 
            value={urgencyPercentage} 
            className="h-2"
          />
          <p className="text-xs text-yellow-600">
            ⚡ Limited quantity - order soon!
          </p>
        </div>
      )}

      {/* Restock notification for out of stock */}
      {isOutOfStock && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Get notified when back in stock</p>
          <p className="text-xs text-muted-foreground mb-2">
            We'll email you as soon as this item is available again.
          </p>
          <button className="text-xs text-primary hover:underline">
            Notify me
          </button>
        </div>
      )}
    </div>
  );
}