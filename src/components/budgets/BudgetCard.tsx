
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
      glass-card p-6 
      transition-all duration-300 ease-out will-change-transform
      hover:shadow-strong hover:scale-[1.01] hover:-translate-y-0.5
      ${isSelected ? 'ring-1 ring-primary/30 shadow-medium border-primary/10 bg-primary/5' : ''}
      animate-fade-in-up cursor-pointer group
    `} style={{
      transform: 'translateZ(0)'
    }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="pt-0.5 opacity-60 hover:opacity-100 transition-opacity">
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={checked => onSelect(budget.id, !!checked)} 
              className="w-3.5 h-3.5 transition-all duration-200 hover:scale-110 border-muted-foreground/40 data-[state=checked]:border-primary/60" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                {budget.device_model || 'Dispositivo não informado'}
              </h3>
              <Badge variant="secondary" className="text-xs bg-muted/40 border border-border/30 backdrop-blur-sm px-2 py-1">
                {budget.device_type || 'Tipo não informado'}
              </Badge>
            </div>
            {budget.client_name && (
              <p className="text-sm text-primary/80 mb-2 font-semibold">
                {budget.client_name}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
              {budget.issue || 'Problema não informado'}
            </p>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-200">
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </p>
          <div className="flex items-center justify-end mt-2">
            <p className="text-xs text-muted-foreground font-medium">
              {budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}
            </p>
            {profile?.budget_warning_enabled && budget.created_at && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
              <Badge variant="destructive" className="text-xs ml-2 px-2 py-1 h-auto status-badge error">
                <Clock className="h-3 w-3 mr-1" />
                Antigo
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/20">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShareWhatsApp(budget)} 
            className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewPDF(budget)} 
            disabled={isGenerating} 
            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-110"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(budget)} 
            className="h-9 w-9 p-0 hover:bg-accent/20 hover:text-primary rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(budget)} 
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
