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
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-black">
          <div className="flex justify-between items-center py-4 bg-black">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-white">Oliver</h1>
            </div>
            <Button onClick={() => window.location.href = '/auth'} className="bg-[#fec832]">Login</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
            Gerencie seus <span className="text-[#fec832]">Orçamentos</span>
            <br />
            de forma profissional
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white">
            Sistema completo para assistências técnicas gerenciarem orçamentos, 
            clientes e relatórios de forma eficiente e organizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = '/auth'} className="text-lg px-8 py-3 bg-[#fec832]">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-amber-600 text-white -bottom-0 ">Entre em contato</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
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
            icon: Users,
            title: "Controle de Clientes",
            description: "Mantenha um histórico completo dos seus clientes e todos os serviços realizados."
          }, {
            icon: TrendingUp,
            title: "Relatórios e Analytics",
            description: "Acompanhe o desempenho do seu negócio com gráficos e métricas detalhadas."
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
            return <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#fec832] py-0">
                      <Icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white">{feature.description}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">
            Pronto para otimizar sua assistência técnica?
          </h3>
          <p className="text-xl mb-8 text-white">
            Junte-se a centenas de profissionais que já utilizam o BudgetFlow 
            para gerenciar seus negócios de forma mais eficiente.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/auth'} className="text-lg px-8 py-3 bg-[#fec832] text-black ">
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-8 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calculator className="h-6 w-6 text-amber-500" />
            <span className="text-xl font-bold">Oliver</span>
          </div>
          <p className="text-gray-400">© 2025 Oliver. Sistema profissional para gestão de orçamentos.</p>
        </div>
      </footer>
    </div>;
};
export default Index;