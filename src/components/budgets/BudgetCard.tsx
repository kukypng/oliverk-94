
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Eye, Edit, Clock, Trash2 } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';

interface BudgetCardProps {
  budget: any;
  profile: any;
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

export const BudgetCard = ({
  budget,
  profile,
  isGenerating,
  isSelected,
  onSelect,
  onShareWhatsApp,
  onViewPDF,
  onEdit,
  onDelete
}: BudgetCardProps) => {
  if (!budget || !budget.id) {
    console.warn('BudgetCard: budget inválido:', budget);
    return null;
  }

  return (
    <div className={`
      glass-card border border-white/10 rounded-2xl p-4 
      transition-all duration-300 ease-out
      hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
      ${isSelected ? 'ring-2 ring-[#fec832] ring-opacity-50 shadow-lg' : ''}
      animate-fade-in cursor-pointer group
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(budget.id, !!checked)}
              className="w-5 h-5 transition-all duration-200 hover:scale-110"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-base text-foreground group-hover:text-[#fec832] transition-colors duration-200">
                {budget.device_model || 'Dispositivo não informado'}
              </h3>
              <Badge variant="secondary" className="text-xs bg-muted/50 transition-all duration-200 group-hover:bg-[#fec832]/10">
                {budget.device_type || 'Tipo não informado'}
              </Badge>
            </div>
            {budget.client_name && (
              <p className="text-sm text-muted-foreground mb-1 transition-colors duration-200 group-hover:text-foreground/80">
                {budget.client_name}
              </p>
            )}
            <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
              {budget.issue || 'Problema não informado'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-foreground group-hover:text-[#fec832] transition-colors duration-200">
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </p>
          <div className="flex items-center justify-end">
            <p className="text-xs text-muted-foreground">
              {budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}
            </p>
            {profile?.budget_warning_enabled && budget.created_at && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
              <Badge variant="destructive" className="text-xs ml-2 animate-pulse p-1 h-auto">
                <Clock className="h-3 w-3 mr-1" />
                Antigo
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShareWhatsApp(budget)} 
            className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewPDF(budget)} 
            disabled={isGenerating} 
            className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl transition-all duration-200 hover:scale-110 disabled:opacity-50"
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(budget)} 
            className="h-10 w-10 p-0 hover:bg-muted/20 hover:text-[#fec832] rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(budget)} 
            className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
