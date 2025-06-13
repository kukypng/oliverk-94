
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus } from 'lucide-react';

interface BudgetFormData {
  clientName: string;
  clientPhone: string;
  deviceModel: string;
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
}

interface NewBudgetFormProps {
  onBack: () => void;
}

export const NewBudgetForm = ({ onBack }: NewBudgetFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<BudgetFormData>({
    clientName: '',
    clientPhone: '',
    deviceModel: '',
    partType: '',
    brand: '',
    warrantyMonths: 3,
    cashPrice: 0,
    installmentPrice: 0,
    installments: 1,
    includesDelivery: false,
    includesScreenProtector: false,
    enableInstallmentPrice: true,
    notes: ''
  });

  // Buscar marcas disponíveis
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*');
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
      // Primeiro, verificar/criar cliente
      let clientId;
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', data.clientPhone)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: data.clientName,
            phone: data.clientPhone
          })
          .select('id')
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }

      // Criar orçamento
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          client_name: data.clientName,
          client_phone: data.clientPhone,
          device_model: data.deviceModel,
          device_type: 'Smartphone', // Default baseado na imagem
          issue: `Troca de ${data.partType}`,
          part_type: data.partType,
          warranty_months: data.warrantyMonths,
          cash_price: Math.round(data.cashPrice * 100), // Converter para centavos
          installment_price: data.enableInstallmentPrice ? Math.round(data.installmentPrice * 100) : null,
          installments: data.enableInstallmentPrice ? data.installments : 1,
          total_price: Math.round(data.cashPrice * 100),
          includes_delivery: data.includesDelivery,
          includes_screen_protector: data.includesScreenProtector,
          notes: data.notes,
          status: 'pending'
        })
        .select('id')
        .single();

      if (budgetError) throw budgetError;

      // Criar item do orçamento
      const { error: partError } = await supabase
        .from('budget_parts')
        .insert({
          budget_id: budget.id,
          name: `${data.partType} - ${data.deviceModel}`,
          part_type: data.partType,
          brand_id: null, // Agora é texto livre
          quantity: 1,
          price: Math.round(data.cashPrice * 100),
          cash_price: Math.round(data.cashPrice * 100),
          installment_price: data.enableInstallmentPrice ? Math.round(data.installmentPrice * 100) : null,
          warranty_months: data.warrantyMonths
        });

      if (partError) throw partError;

      return budget;
    },
    onSuccess: () => {
      toast({
        title: "Orçamento criado com sucesso!",
        description: "O orçamento foi criado e salvo na base de dados.",
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      onBack();
    },
    onError: (error) => {
      console.error('Erro ao criar orçamento:', error);
      toast({
        title: "Erro ao criar orçamento",
        description: "Ocorreu um erro ao salvar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.deviceModel || !formData.partType) {
      toast({
        title: "Preencha os campos obrigatórios",
        description: "Nome, telefone, modelo do aparelho e tipo de peça são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    createBudgetMutation.mutate(formData);
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
          <p className="text-gray-600 mt-2">Crie um novo orçamento para seu cliente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Telefone *</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deviceModel">Modelo do Aparelho *</Label>
              <Input
                id="deviceModel"
                value={formData.deviceModel}
                onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
                placeholder="Ex: iPhone 12, Redmi Note 8"
                required
              />
            </div>

            <div>
              <Label htmlFor="partType">Qual peça vai ser trocada? / Serviço a ser realizado *</Label>
              <Input
                id="partType"
                value={formData.partType}
                onChange={(e) => setFormData({...formData, partType: e.target.value})}
                placeholder="Ex: Tela, Bateria, Troca de conector, Limpeza..."
                required
              />
            </div>

            <div>
              <Label htmlFor="brand">Marca da Peça</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="Ex: Original, Incell, OLED, Compatível..."
              />
            </div>

            <div>
              <Label htmlFor="warranty">Garantia</Label>
              <Select 
                value={formData.warrantyMonths.toString()} 
                onValueChange={(value) => setFormData({...formData, warrantyMonths: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {warrantyPeriods?.map((period) => (
                    <SelectItem key={period.id} value={period.months.toString()}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cashPrice">Valor à Vista (R$) *</Label>
              <Input
                id="cashPrice"
                type="number"
                step="0.01"
                value={formData.cashPrice}
                onChange={(e) => setFormData({...formData, cashPrice: parseFloat(e.target.value) || 0})}
                placeholder="0,00"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableInstallmentPrice"
                checked={formData.enableInstallmentPrice}
                onCheckedChange={(checked) => setFormData({...formData, enableInstallmentPrice: checked})}
              />
              <Label htmlFor="enableInstallmentPrice">Ativar valor parcelado</Label>
            </div>

            {formData.enableInstallmentPrice && (
              <>
                <div>
                  <Label htmlFor="installmentPrice">Valor Parcelado (R$)</Label>
                  <Input
                    id="installmentPrice"
                    type="number"
                    step="0.01"
                    value={formData.installmentPrice}
                    onChange={(e) => setFormData({...formData, installmentPrice: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <Label htmlFor="installments">Número de Parcelas</Label>
                  <Select 
                    value={formData.installments.toString()} 
                    onValueChange={(value) => setFormData({...formData, installments: parseInt(value)})}
                  >
                    <SelectTrigger>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opções Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="delivery"
                checked={formData.includesDelivery}
                onCheckedChange={(checked) => setFormData({...formData, includesDelivery: checked as boolean})}
              />
              <Label htmlFor="delivery">Incluir entrega e busca</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="screenProtector"
                checked={formData.includesScreenProtector}
                onCheckedChange={(checked) => setFormData({...formData, includesScreenProtector: checked as boolean})}
              />
              <Label htmlFor="screenProtector">Incluir película de brinde</Label>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais sobre o orçamento..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={createBudgetMutation.isPending}
          >
            {createBudgetMutation.isPending ? 'Criando...' : 'Criar Orçamento'}
          </Button>
        </div>
      </form>
    </div>
  );
};
