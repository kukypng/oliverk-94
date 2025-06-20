
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, Eye, Edit, Smartphone } from 'lucide-react';
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className={cn(
      "card-modern border-0 transition-all duration-300 ease-out group hover:shadow-strong hover:-translate-y-1",
      isSelected && "ring-2 ring-primary/40 shadow-glow bg-gradient-to-br from-card to-primary/5"
    )}>
      <CardContent className="p-5">
        {/* Header com seleção e informações do dispositivo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(budget.id, checked as boolean)}
              className="mt-1 shrink-0 w-4 h-4 rounded-lg transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Smartphone className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground text-base truncate">
                  {budget.device_model || 'Dispositivo'}
                </h3>
              </div>
              <Badge 
                variant="secondary" 
                className="text-xs font-medium bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1"
              >
                {budget.device_type || 'Smartphone'}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(budget.price || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 bg-secondary/50 px-2 py-1 rounded-lg">
              {formatDate(budget.created_at)}
            </p>
          </div>
        </div>

        {/* Descrição do problema */}
        <div className="mb-4">
          <div className="p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/50">
            <p className="text-sm text-foreground leading-relaxed line-clamp-2">
              {budget.problem_description || 'Sem descrição do problema'}
            </p>
          </div>
        </div>

        {/* Informações do cliente */}
        {budget.client_name && (
          <div className="mb-4 p-3 bg-gradient-to-r from-accent/30 to-accent/10 rounded-xl border border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Cliente</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {budget.client_name}
            </p>
            {budget.client_phone && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {budget.client_phone}
              </p>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShareWhatsApp(budget)}
              disabled={isGenerating}
              className="h-9 w-9 p-0 rounded-xl text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-200 hover:scale-110"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPDF(budget)}
              disabled={isGenerating}
              className="h-9 w-9 p-0 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200 hover:scale-110"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
              className="h-9 w-9 p-0 rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950 transition-all duration-200 hover:scale-110"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Indicador de status visual */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">Ativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
