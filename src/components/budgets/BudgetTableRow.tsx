
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Eye, Edit, Trash2, Clock } from '@/components/ui/icons';

interface BudgetTableRowProps {
  budget: any;
  profile: any;
  index: number;
  isGenerating: boolean;
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
  onShareWhatsApp,
  onViewPDF,
  onEdit,
  onDelete
}: BudgetTableRowProps) => {
  // Verificar se o budget é válido antes de renderizar
  if (!budget || !budget.id) {
    console.warn('BudgetTableRow: budget inválido:', budget);
    return null;
  }

  const handleDelete = () => {
    if (budget && budget.id) {
      console.log('BudgetTableRow: Iniciando exclusão do orçamento:', budget.id);
      onDelete(budget);
    } else {
      console.error('BudgetTableRow: Tentativa de deletar budget inválido:', budget);
    }
  };

  return (
    <>
      <TableCell>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{budget.device_model || 'Dispositivo não informado'}</p>
          <p className="text-sm text-muted-foreground">{budget.device_type || 'Tipo não informado'}</p>
          {budget.client_name && (
            <p className="text-sm text-muted-foreground">{budget.client_name}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{budget.issue || 'Problema não informado'}</span>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </p>
          {budget.installments > 1 && (
            <p className="text-xs text-muted-foreground">{budget.installments}x</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}
          </span>
          {profile?.budget_warning_enabled && budget.created_at && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Clock className="h-4 w-4 text-destructive animate-pulse" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este orçamento tem mais de {profile.budget_warning_days} dias.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShareWhatsApp(budget)} 
            className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewPDF(budget)} 
            disabled={isGenerating} 
            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(budget)} 
            className="h-9 w-9 p-0 hover:bg-muted/20 hover:text-[#fec832] rounded-xl"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete} 
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </>
  );
};
