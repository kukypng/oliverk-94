import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Copy } from 'lucide-react';
import { Budget } from './types';
interface RecentBudgetItemProps {
  budget: Budget;
  index: number;
  hasPermission: (permission: string) => boolean;
}
export const RecentBudgetItem = ({
  budget,
  index,
  hasPermission
}: RecentBudgetItemProps) => {
  return <div className="flex items-center justify-between p-4 lg:p-5 glass-card border border-white/10 rounded-2xl hover:bg-muted/20 transition-all duration-300 group animate-fade-in hover:scale-[1.01]" style={{
    animationDelay: `${index * 50}ms`
  }}>
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex flex-col space-y-2">
          <div>
            <p className="font-semibold text-sm lg:text-base text-foreground group-hover:text-[#fec832] transition-colors truncate">
              {budget.client_name || 'Cliente não informado'}
            </p>
            <p className="text-xs lg:text-sm text-muted-foreground truncate">{budget.device_model}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm lg:text-base text-foreground">
              R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
            </p>
            
          </div>
        </div>
      </div>
      {hasPermission('edit_own_budgets') && <div className="flex space-x-1 ml-2 opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-[#fec832]/10 hover:text-[#fec832]">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-purple-50 hover:text-purple-600">
            <Copy className="h-4 w-4" />
          </Button>
        </div>}
    </div>;
};