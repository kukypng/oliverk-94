
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Eye, Edit, Clock } from '@/components/ui/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';

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
  const { isMobile, isTablet, density } = useLayout();

  if (!budget || !budget.id) {
    console.warn('BudgetCard: budget inválido:', budget);
    return null;
  }

  const isCompact = density === 'compact';

  // Definir tamanho do checkbox baseado no dispositivo
  const getCheckboxSize = () => {
    if (isMobile) return 'w-5 h-5'; // 20px para mobile
    if (isTablet) return 'w-4 h-4'; // 16px para tablet
    return 'w-3.5 h-3.5'; // 14px para desktop
  };

  // Definir área de toque expandida para mobile
  const getCheckboxContainer = () => {
    if (isMobile) return 'p-2 -m-2'; // Área de toque maior para mobile
    if (isTablet) return 'p-1.5 -m-1.5'; // Área de toque média para tablet
    return 'p-0.5'; // Área normal para desktop
  };

  return (
    <div className={cn(
      "glass-card transition-all duration-300 ease-out will-change-transform hover:shadow-brand-glow hover:scale-[1.01] hover:-translate-y-0.5 animate-fade-in-up cursor-pointer group w-full",
      "bg-glass-gradient border-brand-green/20 dark:border-brand-green/30",
      isSelected ? 'ring-2 ring-brand-green/40 shadow-brand-glow border-brand-green/50 bg-brand-green/5' : '',
      isCompact ? 'p-4' : 'p-6'
    )} style={{
      transform: 'translateZ(0)'
    }}>
      <div className={cn("flex items-start justify-between", isCompact ? "mb-3" : "mb-4")}>
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className={cn("flex items-center space-x-2", isCompact ? "mb-2" : "mb-3")}>
              <h3 className="font-bold text-lg text-foreground group-hover:text-brand-green transition-colors duration-200 truncate">
                {budget.device_model || 'Dispositivo não informado'}
              </h3>
              <Badge variant="secondary" className="text-xs bg-brand-green/10 border border-brand-green/30 backdrop-blur-sm px-2 py-1 flex-shrink-0 text-brand-green">
                {budget.device_type || 'Tipo não informado'}
              </Badge>
            </div>
            {budget.client_name && (
              <p className={cn("text-sm text-brand-green font-semibold", isCompact ? "mb-1" : "mb-2")}>
                {budget.client_name}
              </p>
            )}
            <p className={cn("text-sm text-muted-foreground leading-relaxed line-clamp-2", isCompact ? "mb-2" : "mb-3")}>
              {budget.issue || 'Problema não informado'}
            </p>
          </div>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <p className={cn("font-bold text-foreground group-hover:text-brand-green transition-colors duration-200", isCompact ? "text-lg" : "text-xl")}>
            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </p>
          <div className={cn("flex items-center justify-end", isCompact ? "mt-1" : "mt-2")}>
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
      
      <div className={cn("flex items-center justify-between border-t border-brand-green/20", isCompact ? "pt-3" : "pt-4")}>
        <div className="flex items-center space-x-1 w-full justify-center">
          <div className={cn(
            "opacity-60 hover:opacity-100 transition-all duration-200 flex-shrink-0 rounded-md",
            getCheckboxContainer(),
            isMobile && "hover:bg-brand-green/10"
          )}>
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={checked => onSelect(budget.id, !!checked)} 
              className={cn(
                "transition-all duration-200 hover:scale-110 border-2",
                getCheckboxSize(),
                isMobile && "border-brand-green/60 data-[state=checked]:border-brand-green",
                isTablet && "border-brand-green/50 data-[state=checked]:border-brand-green/80",
                !isMobile && !isTablet && "border-brand-green/40 data-[state=checked]:border-brand-green/60"
              )} 
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onShareWhatsApp(budget)} 
            className={cn(
              "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl transition-all duration-200 hover:scale-110",
              isCompact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
            )}
          >
            <MessageCircle className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewPDF(budget)} 
            disabled={isGenerating} 
            className={cn(
              "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-110",
              isCompact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
            )}
          >
            <Eye className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(budget)} 
            className={cn(
              "hover:bg-brand-green/10 hover:text-brand-green rounded-xl transition-all duration-200 hover:scale-110",
              isCompact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
            )}
          >
            <Edit className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </Button>
        </div>
      </div>
    </div>
  );
};
