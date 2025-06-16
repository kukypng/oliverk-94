
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, MessageCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    $MPC_loaded?: boolean;
    attachEvent?: (event: string, callback: () => void) => void;
  }
}

interface SiteSettings {
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

// Link fixo de pagamento - não pode ser alterado
const FIXED_PAYMENT_URL = 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=bbb0d6d04e3440f395e562d80f870761';

export const PlansPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Fetch site settings from database
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        // Return default fallback values
        return {
          plan_name: 'Plano Profissional',
          plan_description: 'Para assistências técnicas que querem crescer',
          plan_price: 15,
          plan_currency: 'R$',
          plan_period: '/mês',
          plan_features: [
            "Sistema completo de orçamentos",
            "Gestão de clientes ilimitada",
            "Relatórios e estatísticas",
            "Cálculos automáticos",
            "Controle de dispositivos",
            "Suporte técnico incluso",
            "Atualizações gratuitas",
            "Backup automático"
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
        } as SiteSettings;
      }
      
      return data as SiteSettings;
    }
  });

  useEffect(() => {
    // Load MercadoPago script
    const loadMercadoPagoScript = () => {
      if (window.$MPC_loaded) return;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `${window.location.protocol}//secure.mlstatic.com/mptools/render.js`;
      
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
      
      window.$MPC_loaded = true;
    };

    if (window.$MPC_loaded !== true) {
      if (window.attachEvent) {
        window.attachEvent('onload', loadMercadoPagoScript);
      } else {
        window.addEventListener('load', loadMercadoPagoScript, false);
      }
    }

    loadMercadoPagoScript();
  }, []);

  const handlePlanSelection = () => {
    setShowConfirmation(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmation(false);
    // Usar sempre o link fixo de pagamento
    console.log('Redirecting to fixed payment URL:', FIXED_PAYMENT_URL);
    window.location.href = FIXED_PAYMENT_URL;
  };

  // Show loading state while fetching settings
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Use settings or fallback values
  const config = settings || {
    plan_name: 'Plano Profissional',
    plan_description: 'Para assistências técnicas que querem crescer',
    plan_price: 15,
    plan_currency: 'R$',
    plan_period: '/mês',
    plan_features: [
      "Sistema completo de orçamentos",
      "Gestão de clientes ilimitada",
      "Relatórios e estatísticas",
      "Cálculos automáticos",
      "Controle de dispositivos",
      "Suporte técnico incluso",
      "Atualizações gratuitas",
      "Backup automático"
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img src="/icone.png" alt="Oliver Logo" className="h-12 w-12" />
            <h1 className="text-4xl font-bold text-foreground">Oliver</h1>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {config.page_title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {config.page_subtitle}
          </p>
        </div>

        {/* Plan Card */}
        <div className="max-w-md mx-auto">
          <Card className="glass-card animate-scale-in border-0 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Popular badge - conditionally rendered */}
            {config.show_popular_badge && (
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {config.popular_badge_text}
                </div>
              </div>
            )}

            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-3xl text-foreground mb-2">{config.plan_name}</CardTitle>
              <CardDescription className="text-base mb-4">
                {config.plan_description}
              </CardDescription>
              <div className="mb-6">
                <span className="text-5xl font-bold text-primary">{config.plan_currency} {config.plan_price}</span>
                <span className="text-muted-foreground text-lg">{config.plan_period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                {config.plan_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                onClick={handlePlanSelection}
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                size="lg"
              >
                {config.cta_button_text}
              </Button>

              {/* Support info - conditionally rendered */}
              {config.show_support_info && (
                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {config.support_text}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            {config.additional_info}
          </p>
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmPayment}
        title="Confirmar Assinatura"
        description="Você será redirecionado para o MercadoPago para finalizar o pagamento. Após a confirmação do pagamento, envie o comprovante para nosso WhatsApp para ativarmos sua conta imediatamente."
        confirmButtonText="Ir para Pagamento"
        cancelButtonText="Cancelar"
      />

      {/* WhatsApp Contact Info */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full glass-card border-0 shadow-2xl backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Instruções Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Após o pagamento:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Tire um print do comprovante de pagamento</li>
                  <li>Envie para nosso WhatsApp</li>
                  <li>Aguarde a ativação da sua conta</li>
                </ol>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => window.open(`https://wa.me/${config.whatsapp_number}`, '_blank')}
                  variant="outline"
                  className="w-full mb-3"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Abrir WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground">
                  ({config.whatsapp_number.replace(/^55/, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')})
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirmPayment}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
