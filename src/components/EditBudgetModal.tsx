import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditBudgetModalProps {
  budget: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditBudgetModal = ({ budget, open, onOpenChange }: EditBudgetModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    device_type: '',
    device_model: '',
    device_brand: '',
    issue: '',
    total_price: '',
    payment_condition: '',
    installments: 1,
    notes: '',
    validity_period_days: ''
  });

  // Carregar dados do orçamento quando o modal abrir ou budget mudar
  useEffect(() => {
    if (budget && open) {
      let days = 15; // Fallback
      if (budget.created_at && budget.valid_until) {
        const createdAt = new Date(budget.created_at);
        const validUntil = new Date(budget.valid_until);
        if (!isNaN(createdAt.getTime()) && !isNaN(validUntil.getTime())) {
          const diffTime = validUntil.getTime() - createdAt.getTime();
          days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }
      }

      setFormData({
        device_type: budget.device_type || '',
        device_model: budget.device_model || '',
        device_brand: budget.device_brand || '',
        issue: budget.issue || '',
        total_price: budget.total_price ? (budget.total_price / 100).toString() : '',
        payment_condition: budget.payment_condition || 'À Vista',
        installments: budget.installments || 1,
        notes: budget.notes || '',
        validity_period_days: days.toString()
      });
    }
  }, [budget, open]);

  const updateBudgetMutation = useMutation({
    mutationFn: async (data: any) => {
      const createdAt = new Date(budget.created_at);
      const validUntilDate = new Date(createdAt);
      const validityDays = parseInt(data.validity_period_days) || 15;
      validUntilDate.setDate(validUntilDate.getDate() + validityDays);

      const totalPrice = parseFloat(data.total_price) || 0;

      const updateData = {
        device_type: data.device_type,
        device_model: data.device_model,
        device_brand: data.device_brand,
        issue: data.issue,
        total_price: Math.round(totalPrice * 100),
        payment_condition: data.payment_condition,
        installments: data.installments,
        notes: data.notes,
        valid_until: validUntilDate.toISOString()
      };

      const { error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', budget.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Orçamento atualizado",
        description: "As alterações foram salvas com sucesso."
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating budget:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.device_model || !formData.issue || !formData.total_price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const totalPrice = parseFloat(formData.total_price);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido para o orçamento.",
        variant: "destructive"
      });
      return;
    }

    updateBudgetMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Orçamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Dispositivo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações do Dispositivo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device_type">Tipo de Dispositivo*</Label>
                <Select value={formData.device_type} onValueChange={value => handleInputChange('device_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Notebook">Notebook</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="Console">Console</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="device_brand">Marca</Label>
                <Input id="device_brand" value={formData.device_brand} onChange={e => handleInputChange('device_brand', e.target.value)} placeholder="Ex: Apple, Samsung, etc." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="device_model">Modelo do Dispositivo*</Label>
              <Input id="device_model" value={formData.device_model} onChange={e => handleInputChange('device_model', e.target.value)} placeholder="Ex: iPhone 13, Galaxy S21, etc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue">Problema Relatado*</Label>
              <Input id="issue" value={formData.issue} onChange={e => handleInputChange('issue', e.target.value)} placeholder="Descreva o problema" required />
            </div>
          </div>

          {/* Informações Financeiras */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações do Orçamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_price">Valor Total (R$)*</Label>
                <Input
                  id="total_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_price}
                  onChange={(e) => handleInputChange('total_price', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installments">Parcelas</Label>
                <Select
                  value={formData.installments.toString()}
                  onValueChange={(value) => handleInputChange('installments', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 10, 12].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x {num === 1 ? '(À vista)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_condition">Condição de Pagamento</Label>
                <Select value={formData.payment_condition} onValueChange={value => handleInputChange('payment_condition', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À Vista">À Vista</SelectItem>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="Transferência">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validity_period_days">Validade (dias)*</Label>
                <Input
                  id="validity_period_days"
                  type="number"
                  min="1"
                  value={formData.validity_period_days}
                  onChange={(e) => handleInputChange('validity_period_days', e.target.value)}
                  placeholder="15"
                  required
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} placeholder="Observações adicionais sobre o orçamento..." rows={3} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateBudgetMutation.isPending}>
              {updateBudgetMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
