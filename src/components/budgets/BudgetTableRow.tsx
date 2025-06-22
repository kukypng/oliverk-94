
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Eye, Edit, Clock, Trash2 } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';

interface BudgetTableRowProps {
  budget: any;
  profile: any;
  index: number;
  isGenerating: boolean;
  isSelected: boolean;
  onSelect: (budgetId: string, isSelected: boolean) => void;
  onShareWhatsApp: (budget: any) => void;
  onViewPDF: (budget: any) => void;
  onEdit: (budget: any) => void;
  onDelete: (budget: any) => void;
}

const isBudgetOld = (createdAt: string, warningDays: number | undefined | null): boolean => {
  if (!createdAt || !warningDays) return false;
  const now = new Date();
  const budgetDate = new Date(createdAt);
  const diffTime = now.getTime() - budgetDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > warningDays;
};

export const BudgetTableRow = ({
  budget,
  profile,
  index,
  isGenerating,
  isSelected,
  onSelect,
  onShareWhatsApp,
  onViewPDF,
  onEdit,
  onDelete
}: BudgetTableRowProps) => {
  if (!budget || !budget.id) {
    console.warn('BudgetTableRow: budget inválido:', budget);
    return null;
  }

  return <>
      <TableCell className="w-8">
        <div className="opacity-60 hover:opacity-100 transition-opacity">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={checked => onSelect(budget.id, !!checked)} 
            className="w-3.5 h-3.5 transition-all duration-200 hover:scale-110 border-muted-foreground/40 data-[state=checked]:border-primary/60" 
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <p className="font-bold text-base text-foreground transition-colors duration-150 group-hover:text-[#fec832]">
            {budget.device_model || 'Dispositivo não informado'}
          </p>
          <p className="text-sm text-muted-foreground font-medium">{budget.device_type || 'Tipo não informado'}</p>
          {budget.client_name && <p className="text-sm text-primary/80 font-semibold">{budget.client_name}</p>}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm leading-relaxed">{budget.issue || 'Problema não informado'}</span>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="font-bold text-lg text-foreground transition-colors duration-150 group-hover:text-[#fec832]">
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}
          </p>
          {budget.installments > 1 && <p className="text-xs text-muted-foreground font-medium">{budget.installments}x</p>}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground font-medium">
            {budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}
          </span>
          {profile?.budget_warning_enabled && budget.created_at && isBudgetOld(budget.created_at, profile.budget_warning_days) && 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Clock className="h-4 w-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este orçamento tem mais de {profile.budget_warning_days} dias.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShareWhatsApp(budget)} 
            className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl transition-all duration-150"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewPDF(budget)} 
            disabled={isGenerating} 
            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition-all duration-150 disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(budget)} 
            className="h-9 w-9 p-0 hover:bg-muted/20 hover:text-[#fec832] rounded-xl transition-all duration-150"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(budget)} 
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all duration-150"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </>;
};
