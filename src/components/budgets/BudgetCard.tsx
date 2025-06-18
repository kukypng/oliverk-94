
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Eye, Edit, Clock } from '@/components/ui/icons';
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
  onEdit
}: BudgetCardProps) => {
  if (!budget || !budget.id) {
    console.warn('BudgetCard: budget inválido:', budget);
    return null;
  }

  return (
    <div className={`
      card-modern p-4 lg:p-5
      transition-all duration-300 ease-out will-change-transform
      hover:shadow-strong hover:scale-[1.01] hover:-translate-y-0.5
      ${isSelected ? 'ring-2 ring-primary/40 shadow-strong border-primary/25 bg-primary/3' : ''}
      animate-fade-in-up cursor-pointer group gpu-accelerated
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="pt-0.5">
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={checked => onSelect(budget.id, !!checked)} 
              className="checkbox-modern"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                {budget.device_model || 'Dispositivo não informado'}
              </h3>
              <Badge variant="secondary" className="text-xs bg-primary/8 text-primary border border-primary/15 backdrop-blur-sm shrink-0">
                {budget.device_type || 'Tipo não informado'}
              </Badge>
            </div>
            {budget.client_name && (
              <p className="text-sm text-muted-foreground mb-2 font-medium truncate">
                {budget.client_name}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {budget.issue || 'Problema não informado'}
            </p>
          </div>
        </div>
        <div className="text-right ml-3 shrink-0">
          <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </p>
          <div className="flex items-center justify-end mt-1 space-x-1">
            <p className="text-xs text-muted-foreground">
              {budget.created_at ? new Date(budget.created_at).toLocaleDateString('pt-BR') : 'Data não informada'}
            </p>
            {profile?.budget_warning_enabled && budget.created_at && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-auto status-badge-modern error">
                <Clock className="h-3 w-3 mr-0.5" />
                Antigo
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-primary/8">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onShareWhatsApp(budget)} 
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-500/10 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartilhar no WhatsApp</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewPDF(budget)} 
                  disabled={isGenerating} 
                  className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-110"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(budget)} 
                  className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar orçamento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {isSelected && (
          <Badge className="text-xs bg-primary/10 text-primary border border-primary/20 animate-scale-in">
            Selecionado
          </Badge>
        )}
      </div>
    </div>
  );
};
