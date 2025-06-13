
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
import { ArrowLeft, Plus, User, Smartphone, DollarSign, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 sm:p-8 mobile-padding">
      <div className="animate-fade-in">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-4 hover-lift"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Novo Orçamento</h1>
            <p className="text-muted-foreground mobile-text">Crie um novo orçamento para seu cliente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <Card className="hover-lift glass-effect mobile-card animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <User className="h-5 w-5 mr-2 text-primary" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName" className="mobile-text">Nome do Cliente *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Digite o nome completo"
                    required
                    className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone" className="mobile-text">Telefone *</Label>
                  <Input
                    id="clientPhone"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    required
                    className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift glass-effect mobile-card animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                Informações do Dispositivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deviceModel" className="mobile-text">Modelo do Aparelho *</Label>
                <Input
                  id="deviceModel"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
                  placeholder="Ex: iPhone 12, Redmi Note 8"
                  required
                  className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="partType" className="mobile-text">Qual peça vai ser trocada? / Serviço a ser realizado *</Label>
                <Input
                  id="partType"
                  value={formData.partType}
                  onChange={(e) => setFormData({...formData, partType: e.target.value})}
                  placeholder="Ex: Tela, Bateria, Troca de conector, Limpeza..."
                  required
                  className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="mobile-text">Marca da Peça</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Ex: Original, Incell, OLED, Compatível..."
                    className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <Label htmlFor="warranty" className="mobile-text">Garantia</Label>
                  <Select 
                    value={formData.warrantyMonths.toString()} 
                    onValueChange={(value) => setFormData({...formData, warrantyMonths: parseInt(value)})}
                  >
                    <SelectTrigger className="mt-1 h-12 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border shadow-lg">
                      {warrantyPeriods?.map((period) => (
                        <SelectItem key={period.id} value={perio                        />
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift glass-effect mobile-card animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                Preços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cashPrice" className="mobile-text">Valor à Vista (R$) *</Label>
                <Input
                  id="cashPrice"
                  type="number"
                  step="0.01"
                  value={formData.cashPrice}
                  onChange={(e) => setFormData({...formData, cashPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0,00"
                  required
                  className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Switch
                  id="enableInstallmentPrice"
                  checked={formData.enableInstallmentPrice}
                  onCheckedChange={(checked) => setFormData({...formData, enableInstallmentPrice: checked})}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="enableInstallmentPrice" className="mobile-text cursor-pointer">
                  Ativar valor parcelado
                </Label>
              </div>

              {formData.enableInstallmentPrice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                  <div>
                    <Label htmlFor="installmentPrice" className="mobile-text">Valor Parcelado (R$)</Label>
                    <Input
                      id="installmentPrice"
                      type="number"
                      step="0.01"
                      value={formData.installmentPrice}
                      onChange={(e) => setFormData({...formData, installmentPrice: parseFloat(e.target.value) || 0})}
                      placeholder="0,00"
                      className="mt-1 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="installments" className="mobile-text">Número de Parcelas</Label>
                    <Select 
                      value={formData.installments.toString()} 
                      onValueChange={(value) => setFormData({...formData, installments: parseInt(value)})}
                    >
                      <SelectTrigger className="mt-1 h-12 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-lg">
                        {paymentConditions?.map((condition) => (
                          <SelectItem key={condition.id} value={condition.installments.toString()}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover-lift glass-effect mobile-card animate-slide-up" style={{animationDelay: '0.3s'}}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Opções Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="delivery"
                    checked={formData.includesDelivery}
                    onCheckedChange={(checked) => setFormData({...formData, includesDelivery: checked as boolean})}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="delivery" className="mobile-text cursor-pointer">
                    Incluir entrega e busca
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="screenProtector"
                    checked={formData.includesScreenProtector}
                    onCheckedChange={(checked) => setFormData({...formData, includesScreenProtector: checked as boolean})}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="screenProtector" className="mobile-text cursor-pointer">
                    Incluir película de brinde
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="mobile-text">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Observações adicionais sobre o orçamento..."
                  className="mt-1 min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="flex-1 h-12 hover-lift"
              size="lg"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground hover-lift"
              disabled={createBudgetMutation.isPending}
              size="lg"
            >
              {createBudgetMutation.isPending ? (
                <>
                  <Plus className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Orçamento
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
