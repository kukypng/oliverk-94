import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BudgetFormData {
  deviceType: string;
  deviceModel: string;
  deviceBrand: string;
  issue: string;
  partType: string;
  brand: string;
  warrantyMonths: number;
  cashPrice: number;
  installmentPrice: number;
  installments: number;
  includesDelivery: boolean;
  includesScreenProtector: boolean;
  enableInstallmentPrice: boolean;
  notes: string;
  validityDays: number;
  paymentCondition: string;
}

interface NewBudgetFormProps {
  onBack: () => void;
}

export const NewBudgetForm = ({ onBack }: NewBudgetFormProps) => {
  const { showSuccess, showError } = useEnhancedToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BudgetFormData>({
    deviceType: '',
    deviceModel: '',
    deviceBrand: '',
    issue: '',
    partType: '',
    brand: '',
    warrantyMonths: 3,
    cashPrice: 0,
    installmentPrice: 0,
    installments: 1,
    includesDelivery: false,
    includesScreenProtector: false,
    enableInstallmentPrice: true,
    notes: '',
    validityDays: 15,
    paymentCondition: 'À Vista'
  });

  // Buscar tipos de dispositivo
  const { data: deviceTypes } = useQuery({
    queryKey: ['device-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('device_types').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  // Buscar tipos de defeito
  const { data: defectTypes } = useQuery({
    queryKey: ['defect-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('defect_types').select('*').order('label');
      if (error) throw error;
      return data;
    }
  });

  // Buscar períodos de garantia
  const { data: warrantyPeriods } = useQuery({
    queryKey: ['warranty-periods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('warranty_periods').select('*').order('months');
      if (error) throw error;
      return data;
    }
  });

  // Buscar condições de pagamento
  const { data: paymentConditions } = useQuery({
    queryKey: ['payment-conditions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_conditions').select('*').order('installments');
      if (error) throw error;
      return data;
    }
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      if (!user) {
        throw new Error('Usuário não está logado');
      }

      console.log('Creating budget for user:', user.id);
      
      // Calcular data de validade baseada nos dias especificados
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + data.validityDays);
      
      // Criar orçamento com owner_id explícito
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          owner_id: user.id,
          device_type: data.deviceType,
          device_model: data.deviceModel,
          device_brand: data.deviceBrand,
          issue: data.issue,
          part_type: data.partType,
          warranty_months: data.warrantyMonths,
          cash_price: Math.round(data.cashPrice * 100),
          installment_price: data.enableInstallmentPrice ? Math.round(data.installmentPrice * 100) : null,
          installments: data.enableInstallmentPrice ? data.installments : 1,
          total_price: Math.round(data.cashPrice * 100),
          includes_delivery: data.includesDelivery,
          includes_screen_protector: data.includesScreenProtector,
          notes: data.notes,
          status: 'pending',
          valid_until: validUntil.toISOString(),
          payment_condition: data.paymentCondition
        })
        .select('id')
        .single();

      if (budgetError) {
        console.error('Budget creation error:', budgetError);
        throw budgetError;
      }

      console.log('Budget created:', budget.id);

      // Criar item do orçamento
      const { error: partError } = await supabase
        .from('budget_parts')
        .insert({
          budget_id: budget.id,
          name: `${data.partType} - ${data.deviceModel}`,
          part_type: data.partType,
          brand_id: null,
          quantity: 1,
          price: Math.round(data.cashPrice * 100),
          cash_price: Math.round(data.cashPrice * 100),
          installment_price: data.enableInstallmentPrice ? Math.round(data.installmentPrice * 100) : null,
          warranty_months: data.warrantyMonths
        });

      if (partError) {
        console.error('Budget part creation error:', partError);
        throw partError;
      }

      console.log('Budget part created successfully');
      return budget;
    },
    onSuccess: () => {
      showSuccess({
        title: "Orçamento criado com sucesso!",
        description: `O orçamento foi criado e está válido por ${formData.validityDays} dias.`,
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      onBack();
    },
    onError: (error: any) => {
      console.error('Erro ao criar orçamento:', error);
      showError({
        title: "Erro ao criar orçamento",
        description: error.message || "Ocorreu um erro ao salvar o orçamento. Tente novamente.",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para criar orçamentos.",
      });
      return;
    }
    
    if (!formData.deviceModel || !formData.partType) {
      showError({
        title: "Preencha os campos obrigatórios",
        description: "Modelo do aparelho e tipo de serviço são obrigatórios.",
      });
      return;
    }
    createBudgetMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
        <p className="text-gray-600">Você precisa estar logado para criar orçamentos.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4 btn-ghost"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-heading font-bold text-gold-900">Novo Orçamento</h1>
          <p className="text-base text-gold-700 mt-2">Crie um novo orçamento personalizado</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card: Infos do Dispositivo */}
        <Card className="card shadow-soft">
          <CardHeader className="card-header">
            <CardTitle>Informações do Dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="card-content space-y-4">
            <div>
              <Label htmlFor="deviceType" className="label">Tipo de Dispositivo</Label>
              <Select
                value={formData.deviceType}
                onValueChange={(value) => setFormData({ ...formData, deviceType: value })}
              >
                <SelectTrigger className="input">
                  <SelectValue placeholder="Selecione o tipo de dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deviceModel" className="label">Modelo do Aparelho *</Label>
              <Input
                className="input"
                id="deviceModel"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                placeholder="Ex: iPhone 12, Redmi Note 8"
                required
              />
            </div>
            <div>
              <Label htmlFor="deviceBrand" className="label">Marca do Dispositivo</Label>
              <Input
                className="input"
                id="deviceBrand"
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                placeholder="Ex: Apple, Samsung, Xiaomi"
              />
            </div>
            <div>
              <Label htmlFor="issue" className="label">Problema/Defeito</Label>
              <Select
                value={formData.issue}
                onValueChange={(value) => setFormData({ ...formData, issue: value })}
              >
                <SelectTrigger className="input">
                  <SelectValue placeholder="Selecione o tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  {defectTypes?.map((defect) => (
                    <SelectItem key={defect.id} value={defect.value}>{defect.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="partType" className="label">Qual serviço será realizado? *</Label>
              <Input
                className="input"
                id="partType"
                value={formData.partType}
                onChange={(e) => setFormData({ ...formData, partType: e.target.value })}
                placeholder="Ex: Troca de tela, Troca de bateria, Limpeza..."
                required
              />
            </div>
            <div>
              <Label htmlFor="brand" className="label">Especificação do Serviço</Label>
              <Input
                className="input"
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Peça original, Incell, OLED, Compatível..."
              />
            </div>
            <div>
              <Label htmlFor="warranty" className="label">Garantia</Label>
              <Select
                value={formData.warrantyMonths.toString()}
                onValueChange={(value) => setFormData({ ...formData, warrantyMonths: parseInt(value) })}
              >
                <SelectTrigger className="input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {warrantyPeriods?.map((period) => (
                    <SelectItem key={period.id} value={period.months.toString()}>{period.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Card: Preços e Condições */}
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle>Preços e Condições</CardTitle>
          </CardHeader>
          <CardContent className="card-content space-y-4">
            <div>
              <Label htmlFor="cashPrice" className="label">Valor à Vista (R$) *</Label>
              <Input
                className="input"
                id="cashPrice"
                type="number"
                step="0.01"
                value={formData.cashPrice}
                onChange={(e) => setFormData({ ...formData, cashPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableInstallmentPrice"
                checked={formData.enableInstallmentPrice}
                onCheckedChange={(checked) => setFormData({ ...formData, enableInstallmentPrice: checked })}
              />
              <Label htmlFor="enableInstallmentPrice" className="label">Ativar valor parcelado</Label>
            </div>
            {formData.enableInstallmentPrice && (
              <>
                <div>
                  <Label htmlFor="installmentPrice" className="label">Valor Parcelado (R$)</Label>
                  <Input
                    className="input"
                    id="installmentPrice"
                    type="number"
                    step="0.01"
                    value={formData.installmentPrice}
                    onChange={(e) => setFormData({ ...formData, installmentPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label htmlFor="installments" className="label">Número de Parcelas</Label>
                  <Select
                    value={formData.installments.toString()}
                    onValueChange={(value) => setFormData({ ...formData, installments: parseInt(value) })}
                  >
                    <SelectTrigger className="input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentConditions?.map((condition) => (
                        <SelectItem key={condition.id} value={condition.installments.toString()}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="paymentCondition" className="label">Condição de Pagamento</Label>
              <Select
                value={formData.paymentCondition}
                onValueChange={(value) => setFormData({ ...formData, paymentCondition: value })}
              >
                <SelectTrigger className="input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="À Vista">À Vista</SelectItem>
                  <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                  <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Card: Validade e Extras */}
        <Card className="card">
          <CardHeader className="card-header">
            <CardTitle>Configurações do Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="card-content space-y-4">
            <div>
              <Label htmlFor="validityDays" className="label">Validade do Orçamento (dias)</Label>
              <Input
                className="input"
                id="validityDays"
                type="number"
                min="1"
                max="365"
                value={formData.validityDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validityDays: parseInt(e.target.value) || 15,
                  })
                }
                placeholder="15"
              />
              <p className="text-sm text-gold-600 mt-1">
                O orçamento será válido por {formData.validityDays} dias a partir da criação
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery"
                checked={formData.includesDelivery}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    includesDelivery: checked as boolean,
                  })
                }
              />
              <Label htmlFor="delivery" className="label">Incluir entrega e busca</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="screenProtector"
                checked={formData.includesScreenProtector}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    includesScreenProtector: checked as boolean,
                  })
                }
              />
              <Label htmlFor="screenProtector" className="label">Incluir película de brinde</Label>
            </div>
            <div>
              <Label htmlFor="notes" className="label">Observações</Label>
              <Textarea
                className="input"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Observações adicionais sobre o orçamento..."
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 btn-outline">
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 btn-cta"
            disabled={createBudgetMutation.isPending}
          >
            {createBudgetMutation.isPending ? 'Criando...' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </div>
  );
};
