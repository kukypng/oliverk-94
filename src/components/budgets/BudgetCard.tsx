
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
      "glass-card border-0 transition-all duration-300 ease-out hover:shadow-medium hover:-translate-y-0.5",
      isSelected && "ring-2 ring-primary/30 bg-primary/5"
    )}>
      <CardContent className="p-4">
        {/* Header with selection and device info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(budget.id, checked as boolean)}
              className="mt-1 shrink-0 w-2 h-2"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Smartphone className="h-4 w-4 text-primary shrink-0" />
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {budget.device_model || 'Dispositivo'}
                </h3>
              </div>
              <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
                {budget.device_type || 'Smartphone'}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(budget.price || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(budget.created_at)}
            </p>
          </div>
        </div>

        {/* Problem description */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {budget.problem_description || 'Sem descrição do problema'}
          </p>
        </div>

        {/* Client info */}
        {budget.client_name && (
          <div className="mb-3 p-2 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Cliente</p>
            <p className="text-sm font-medium text-foreground truncate">
              {budget.client_name}
            </p>
            {budget.client_phone && (
              <p className="text-xs text-muted-foreground mt-1">
                {budget.client_phone}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShareWhatsApp(budget)}
              disabled={isGenerating}
              className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-500/10"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPDF(budget)}
              disabled={isGenerating}
              className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(budget)}
              className="h-8 w-8 p-0 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
