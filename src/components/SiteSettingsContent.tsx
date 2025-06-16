
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Globe, MessageSquare, Star, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  id: string;
  plan_name: string;
  plan_description: string;
  plan_price: number;
  plan_currency: string;
  plan_period: string;
  plan_features: string[];
  payment_url: string;
  whatsapp_number: string;
  page_title: string;
  page_subtitle: string;
  popular_badge_text: string;
  cta_button_text: string;
  support_text: string;
  show_popular_badge: boolean;
  show_support_info: boolean;
  additional_info: string;
}

export const SiteSettingsContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newFeature, setNewFeature] = useState('');
  const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      console.log('Fetching site settings...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }
      
      console.log('Site settings fetched:', data);
      const settingsData = data as SiteSettings;
      setLocalSettings(settingsData);
      return settingsData;
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<SiteSettings>) => {
      if (!settings?.id) throw new Error('Settings ID not found');
      
      console.log('Updating settings with:', updatedSettings);
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(updatedSettings)
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
      
      console.log('Settings updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Update mutation success, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setLocalSettings(data as SiteSettings);
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do site foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    
    console.log(`Updating field ${field} with value:`, value);
    
    // Update local state immediately for better UX
    setLocalSettings(prev => prev ? { ...prev, [field]: value } : null);
    
    // Debounce the actual save to database
    const updatedSettings = { [field]: value };
    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim() || !settings) return;
    
    const updatedFeatures = [...settings.plan_features, newFeature.trim()];
    handleInputChange('plan_features', updatedFeatures);
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    if (!settings) return;
    
    const updatedFeatures = settings.plan_features.filter((_, i) => i !== index);
    handleInputChange('plan_features', updatedFeatures);
  };

  // Use local settings if available, otherwise fall back to server settings
  const currentSettings = localSettings || settings;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentSettings) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Configurações não encontradas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Globe className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Configurações do Site</h1>
          <p className="text-muted-foreground">Gerencie o conteúdo da página de planos</p>
        </div>
      </div>

      {/* Plan Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Informações do Plano
          </CardTitle>
          <CardDescription>Configure os detalhes principais do plano</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan_name">Nome do Plano</Label>
              <Input
                id="plan_name"
                value={currentSettings.plan_name}
                onChange={(e) => handleInputChange('plan_name', e.target.value)}
                placeholder="Ex: Plano Profissional"
              />
            </div>
            <div>
              <Label htmlFor="plan_description">Descrição do Plano</Label>
              <Input
                id="plan_description"
                value={currentSettings.plan_description}
                onChange={(e) => handleInputChange('plan_description', e.target.value)}
                placeholder="Ex: Para assistências técnicas..."
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plan_currency">Moeda</Label>
              <Input
                id="plan_currency"
                value={currentSettings.plan_currency}
                onChange={(e) => handleInputChange('plan_currency', e.target.value)}
                placeholder="R$"
              />
            </div>
            <div>
              <Label htmlFor="plan_price">Preço</Label>
              <Input
                id="plan_price"
                type="number"
                value={currentSettings.plan_price}
                onChange={(e) => handleInputChange('plan_price', Number(e.target.value))}
                placeholder="15"
              />
            </div>
            <div>
              <Label htmlFor="plan_period">Período</Label>
              <Input
                id="plan_period"
                value={currentSettings.plan_period}
                onChange={(e) => handleInputChange('plan_period', e.target.value)}
                placeholder="/mês"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos do Plano</CardTitle>
          <CardDescription>Gerencie a lista de funcionalidades incluídas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Digite uma nova funcionalidade"
              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
            />
            <Button onClick={handleAddFeature} disabled={!newFeature.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div className="space-y-2">
            {currentSettings.plan_features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span>{feature}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Content */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo da Página</CardTitle>
          <CardDescription>Configure textos e títulos da página</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="page_title">Título Principal</Label>
            <Input
              id="page_title"
              value={currentSettings.page_title}
              onChange={(e) => handleInputChange('page_title', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="page_subtitle">Subtítulo</Label>
            <Textarea
              id="page_subtitle"
              value={currentSettings.page_subtitle}
              onChange={(e) => handleInputChange('page_subtitle', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta_button_text">Texto do Botão</Label>
              <Input
                id="cta_button_text"
                value={currentSettings.cta_button_text}
                onChange={(e) => handleInputChange('cta_button_text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="popular_badge_text">Texto do Badge Popular</Label>
              <Input
                id="popular_badge_text"
                value={currentSettings.popular_badge_text}
                onChange={(e) => handleInputChange('popular_badge_text', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="additional_info">Informações Adicionais</Label>
            <Input
              id="additional_info"
              value={currentSettings.additional_info}
              onChange={(e) => handleInputChange('additional_info', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment & Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contato e Suporte
          </CardTitle>
          <CardDescription>Configure informações de contato e suporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL de Pagamento - Agora somente leitura */}
          <div>
            <Label htmlFor="payment_url" className="flex items-center gap-2">
              URL de Pagamento
              <Lock className="h-4 w-4 text-muted-foreground" />
            </Label>
            <Input
              id="payment_url"
              value="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=bbb0d6d04e3440f395e562d80f870761"
              readOnly
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground mt-1">
              ⚠️ Este link de pagamento é fixo e não pode ser alterado por questões de segurança
            </p>
          </div>
          
          <div>
            <Label htmlFor="whatsapp_number">Número do WhatsApp</Label>
            <Input
              id="whatsapp_number"
              value={currentSettings.whatsapp_number}
              onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
              placeholder="556496028022"
            />
          </div>
          
          <div>
            <Label htmlFor="support_text">Texto de Suporte</Label>
            <Input
              id="support_text"
              value={currentSettings.support_text}
              onChange={(e) => handleInputChange('support_text', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opções de Exibição</CardTitle>
          <CardDescription>Configure elementos visuais da página</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show_popular_badge">Mostrar Badge "Popular"</Label>
              <p className="text-sm text-muted-foreground">Exibe o badge destacando o plano como popular</p>
            </div>
            <Switch
              id="show_popular_badge"
              checked={currentSettings.show_popular_badge}
              onCheckedChange={(checked) => handleInputChange('show_popular_badge', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show_support_info">Mostrar Informações de Suporte</Label>
              <p className="text-sm text-muted-foreground">Exibe as informações de suporte na parte inferior</p>
            </div>
            <Switch
              id="show_support_info"
              checked={currentSettings.show_support_info}
              onCheckedChange={(checked) => handleInputChange('show_support_info', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Badge variant="secondary" className="text-xs">
          {updateSettingsMutation.isPending ? "Salvando..." : "Todas as alterações são salvas automaticamente"}
        </Badge>
      </div>
    </div>
  );
};
