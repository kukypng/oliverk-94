
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Save, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteSettings {
  id?: number;
  plan_name: string;
  plan_description: string;
  plan_price: number;
  plan_currency: string;
  plan_period: string;
  plan_features: string[];
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
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<SiteSettings>({
    plan_name: 'Plano Profissional',
    plan_description: 'Para assistências técnicas que querem crescer',
    plan_price: 15,
    plan_currency: 'R$',
    plan_period: '/mês',
    plan_features: [
      "Sistema completo de orçamentos",
      "Gestão de clientes ilimitada",
      "Relatórios e estatísticas"
    ],
    whatsapp_number: '556496028022',
    page_title: 'Escolha seu Plano',
    page_subtitle: 'Tenha acesso completo ao sistema de gestão de orçamentos mais eficiente para assistências técnicas.',
    popular_badge_text: 'Mais Popular',
    cta_button_text: 'Assinar Agora',
    support_text: 'Suporte via WhatsApp incluso',
    show_popular_badge: true,
    show_support_info: true,
    additional_info: '✓ Sem taxa de setup • ✓ Cancele quando quiser • ✓ Suporte brasileiro'
  });

  const [featuresText, setFeaturesText] = useState('');

  // Fetch current site settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(newSettings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Configurações salvas com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (error) => {
      toast.error('Erro ao salvar configurações: ' + error.message);
    }
  });

  // Load current settings when data is available
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
      setFeaturesText(currentSettings.plan_features?.join('\n') || '');
    }
  }, [currentSettings]);

  const handleSave = () => {
    const features = featuresText.split('\n').filter(feature => feature.trim() !== '');
    
    updateMutation.mutate({
      ...settings,
      plan_features: features
    });
  };

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
          <p className="text-muted-foreground">
            Configure as informações exibidas na página de planos
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>URL de Pagamento:</strong> A URL de pagamento está configurada como fixa no sistema e não pode ser alterada através desta interface. 
          URL atual: https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=bbb0d6d04e3440f395e562d80f870761
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Informações do Plano */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan_name">Nome do Plano</Label>
                <Input
                  id="plan_name"
                  value={settings.plan_name}
                  onChange={(e) => handleInputChange('plan_name', e.target.value)}
                  placeholder="Ex: Plano Profissional"
                />
              </div>
              <div>
                <Label htmlFor="plan_description">Descrição do Plano</Label>
                <Input
                  id="plan_description"
                  value={settings.plan_description}
                  onChange={(e) => handleInputChange('plan_description', e.target.value)}
                  placeholder="Ex: Para assistências técnicas que querem crescer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="plan_price">Preço</Label>
                <Input
                  id="plan_price"
                  type="number"
                  value={settings.plan_price}
                  onChange={(e) => handleInputChange('plan_price', parseFloat(e.target.value))}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="plan_currency">Moeda</Label>
                <Input
                  id="plan_currency"
                  value={settings.plan_currency}
                  onChange={(e) => handleInputChange('plan_currency', e.target.value)}
                  placeholder="R$"
                />
              </div>
              <div>
                <Label htmlFor="plan_period">Período</Label>
                <Input
                  id="plan_period"
                  value={settings.plan_period}
                  onChange={(e) => handleInputChange('plan_period', e.target.value)}
                  placeholder="/mês"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="plan_features">Recursos do Plano (um por linha)</Label>
              <Textarea
                id="plan_features"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="Sistema completo de orçamentos&#10;Gestão de clientes ilimitada&#10;Relatórios e estatísticas"
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações da Página */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Página</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="page_title">Título da Página</Label>
              <Input
                id="page_title"
                value={settings.page_title}
                onChange={(e) => handleInputChange('page_title', e.target.value)}
                placeholder="Escolha seu Plano"
              />
            </div>

            <div>
              <Label htmlFor="page_subtitle">Subtítulo da Página</Label>
              <Textarea
                id="page_subtitle"
                value={settings.page_subtitle}
                onChange={(e) => handleInputChange('page_subtitle', e.target.value)}
                placeholder="Tenha acesso completo ao sistema de gestão de orçamentos mais eficiente para assistências técnicas."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="additional_info">Informações Adicionais</Label>
              <Input
                id="additional_info"
                value={settings.additional_info}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                placeholder="✓ Sem taxa de setup • ✓ Cancele quando quiser • ✓ Suporte brasileiro"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="popular_badge_text">Texto do Badge Popular</Label>
                <Input
                  id="popular_badge_text"
                  value={settings.popular_badge_text}
                  onChange={(e) => handleInputChange('popular_badge_text', e.target.value)}
                  placeholder="Mais Popular"
                />
              </div>
              <div>
                <Label htmlFor="cta_button_text">Texto do Botão CTA</Label>
                <Input
                  id="cta_button_text"
                  value={settings.cta_button_text}
                  onChange={(e) => handleInputChange('cta_button_text', e.target.value)}
                  placeholder="Assinar Agora"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_popular_badge"
                  checked={settings.show_popular_badge}
                  onCheckedChange={(checked) => handleInputChange('show_popular_badge', checked)}
                />
                <Label htmlFor="show_popular_badge">Mostrar Badge "Popular"</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show_support_info"
                  checked={settings.show_support_info}
                  onCheckedChange={(checked) => handleInputChange('show_support_info', checked)}
                />
                <Label htmlFor="show_support_info">Mostrar Informações de Suporte</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Suporte */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Suporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp_number">Número do WhatsApp (com código do país)</Label>
              <Input
                id="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                placeholder="556496028022"
              />
            </div>

            <div>
              <Label htmlFor="support_text">Texto de Suporte</Label>
              <Input
                id="support_text"
                value={settings.support_text}
                onChange={(e) => handleInputChange('support_text', e.target.value)}
                placeholder="Suporte via WhatsApp incluso"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
