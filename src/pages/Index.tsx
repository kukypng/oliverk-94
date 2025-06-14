import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Smartphone, Users, TrendingUp, Shield } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loading-states';
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Se o usuário estiver logado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Landing page para usuários não logados
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 via-gold-100 to-gold-200 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b shadow-soft sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-2">
              <Calculator className="h-10 w-10 text-gold-400" />
              <h1 className="text-3xl font-heading font-bold text-zinc-900 tracking-tight">Oliver</h1>
            </div>
            <Button onClick={() => window.location.href = '/auth'} className="btn-cta">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-strong animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-heading font-bold mb-6 text-zinc-900 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-700">Gerencie seus&nbsp;Orçamentos</span>
            <br />
            de forma profissional
          </h2>
          <p className="text-2xl mb-10 max-w-2xl mx-auto text-gold-800">
            Sistema completo para assistências técnicas gerenciarem orçamentos, clientes e relatórios como uma empresa premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/auth'} className="btn-cta text-lg px-10 py-4 rounded-3xl pop-animate">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="btn-outline text-lg px-10 py-4 rounded-3xl">
              Entre em contato
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-14 text-zinc-900 font-heading animate-fade-in">Funcionalidades Principais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: FileText,
                title: "Orçamentos Detalhados",
                description: "Monte orçamentos diferentes para cada cliente, adicione serviços, peças e condições de pagamento personalizadas.",
              },
              {
                icon: Smartphone,
                title: "Gestão de Dispositivos",
                description: "Cadastre e gerencie diferentes dispositivos, marcas e defeitos de modo eficiente.",
              },
              {
                icon: Users,
                title: "Controle de Clientes",
                description: "Acompanhe o histórico de todos os clientes e organize o relacionamento.",
              },
              {
                icon: TrendingUp,
                title: "Relatórios e Analytics",
                description: "Visualize indicadores essenciais e impulsione o crescimento da sua assistência.",
              },
              {
                icon: Shield,
                title: "Segurança Avançada",
                description: "Controle de acesso seguro por usuários e permissões.",
              },
              {
                icon: Calculator,
                title: "Cálculos Automáticos",
                description: "Deixe que o sistema faça os cálculos de totais, descontos e parcelas para você.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card glow-hover shadow-soft hover:shadow-strong animate-scale-in p-6 text-center">
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 bg-gold-100 animate-bounce-subtle">
                    <Icon className="h-7 w-7 text-gold-500" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-zinc-900">{feature.title}</h4>
                  <p className="mt-2 text-base text-zinc-700">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-zinc-900 font-heading">
            Pronto para otimizar sua assistência técnica?
          </h3>
          <p className="text-xl mb-8 text-zinc-600">
            Junte-se a centenas de profissionais que já usam Oliver para ampliar resultados.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/auth'} className="btn-cta text-lg px-12 py-4 rounded-3xl">
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-[#0b0000] rounded-t-3xl">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="h-7 w-7 text-gold-400" />
            <span className="text-2xl font-heading font-bold text-white">Oliver</span>
          </div>
          <p className="text-gold-200">© 2025 Oliver. Sistema profissional para gestão de orçamentos.</p>
        </div>
      </footer>
    </div>
  );
};
export default Index;
