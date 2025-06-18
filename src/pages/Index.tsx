
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Smartphone, Shield, Star, Activity } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loading-states';

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Se o usuário estiver logado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Landing page para usuários não logados
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="backdrop-blur-sm border-b border-primary/10 shadow-soft sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/icone.png" alt="Oliver Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-foreground">Oliver</h1>
            </Link>
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="border-primary/20 text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
            Gerencie seus <span className="text-primary">Orçamentos</span>
            <br />
            de forma profissional
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Sistema completo para assistências técnicas gerenciarem orçamentos, 
            clientes e relatórios de forma eficiente e organizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3 shadow-strong hover:shadow-xl">
              <Link to="/plans">Começar Agora</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary/20 text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30" 
              onClick={() => window.open('https://wa.me/556496028022', '_blank')}
            >
              Entre em contato
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Funcionalidades Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            icon: FileText,
            title: "Orçamentos Detalhados",
            description: "Crie orçamentos profissionais com peças, serviços e condições de pagamento personalizadas."
          }, {
            icon: Smartphone,
            title: "Gestão de Dispositivos",
            description: "Cadastre diferentes tipos de dispositivos, marcas e defeitos para agilizar o atendimento."
          }, {
            icon: Star,
            title: "Preço Acessível",
            description: "Planos que cabem no seu bolso, focados na sua necessidade e sem surpresas."
          }, {
            icon: Activity,
            title: "Agilidade e Utilidade",
            description: "Ferramenta rápida e intuitiva, projetada para otimizar o dia a dia da sua assistência."
          }, {
            icon: Shield,
            title: "Segurança Avançada",
            description: "Controle de acesso por usuário com diferentes níveis de permissão e auditoria completa."
          }, {
            icon: Calculator,
            title: "Cálculos Automáticos",
            description: "Cálculo automático de totais, impostos e condições de pagamento personalizadas."
          }].map((feature, index) => {
            const Icon = feature.icon;
            return <Card key={index} className="border-primary/10 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary/10 border border-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gradient-to-br from-card to-card/80">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>;
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-modern p-12 text-center">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Pronto para otimizar sua assistência técnica?
            </h3>
            <p className="text-xl mb-8 text-muted-foreground">
              Junte-se a centenas de profissionais que já utilizam o Oliver 
              para gerenciar seus negócios de forma mais eficiente.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-3 shadow-strong hover:shadow-xl">
              <Link to="/plans">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-primary/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/icone.png" alt="Oliver Logo" className="h-6 w-6" />
            <span className="text-xl font-bold text-foreground">Oliver</span>
          </div>
          <p className="text-muted-foreground">© 2025 Oliver. Sistema profissional para gestão de orçamentos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
