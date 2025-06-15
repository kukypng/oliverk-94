
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, MessageCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

declare global {
  interface Window {
    $MPC_loaded?: boolean;
  }
}

export const PlansPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    // Redirect to MercadoPago
    window.location.href = "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380849763dae0019775d20c5b05d3";
  };

  const planFeatures = [
    "Sistema completo de orçamentos",
    "Gestão de clientes ilimitada",
    "Relatórios e estatísticas",
    "Cálculos automáticos",
    "Controle de dispositivos",
    "Suporte técnico incluso",
    "Atualizações gratuitas",
    "Backup automático"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/auth">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img src="/icone.png" alt="Oliver Logo" className="h-12 w-12" />
            <h1 className="text-4xl font-bold text-foreground">Oliver</h1>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            Escolha seu <span className="text-primary">Plano</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tenha acesso completo ao sistema de gestão de orçamentos mais eficiente para assistências técnicas.
          </p>
        </div>

        {/* Plan Card */}
        <div className="max-w-md mx-auto">
          <Card className="glass-card animate-scale-in border-0 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                Mais Popular
              </div>
            </div>

            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-3xl text-foreground mb-2">Plano Profissional</CardTitle>
              <CardDescription className="text-base mb-4">
                Para assistências técnicas que querem crescer
              </CardDescription>
              <div className="mb-6">
                <span className="text-5xl font-bold text-primary">R$ 15</span>
                <span className="text-muted-foreground text-lg">/mês</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                {planFeatures.map((feature, index) => (
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
                Assinar Agora
              </Button>

              {/* Support info */}
              <div className="text-center pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Suporte via WhatsApp incluso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            ✓ Sem taxa de setup • ✓ Cancele quando quiser • ✓ Suporte brasileiro
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
                  onClick={() => window.open('https://wa.me/556496028022', '_blank')}
                  variant="outline"
                  className="w-full mb-3"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Abrir WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground">
                  (64) 9602-8022
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
