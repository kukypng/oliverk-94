
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionButton } from '@/components/SubscriptionButton';

const PlansPage = () => {
  const features = [
    "Orçamentos ilimitados",
    "Cadastro de clientes",
    "Relatórios detalhados",
    "Gestão de dispositivos",
    "Cálculos automáticos",
    "Suporte prioritário via WhatsApp",
    "Acesso a todas as atualizações",
  ];

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-black">
          <div className="flex justify-between items-center py-4 bg-black">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/icone.png" alt="Oliver Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-white">Oliver</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-white hover:text-primary">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild>
                {user ? <Link to="/dashboard">Dashboard</Link> : <Link to="/auth">Login</Link>}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-4">
            Escolha o plano <span className="text-primary">perfeito</span> para você
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-400">
            Comece a transformar a gestão da sua assistência técnica hoje mesmo.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-neutral-900 border-primary shadow-strong transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center p-8">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Plano Profissional
              </div>
              <CardTitle className="text-5xl font-bold">R$4<span className="text-lg font-medium text-gray-400">/mês</span></CardTitle>
              <CardDescription className="text-gray-300 mt-2">Acesso completo por 30 dias.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-4">
              <SubscriptionButton 
                size="lg" 
                className="w-full text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Star className="mr-2 h-5 w-5" />
                Assinar Agora
              </SubscriptionButton>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-12 text-gray-500">
          <p>Dúvidas? <a href="https://wa.me/556496028022" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Fale conosco pelo WhatsApp</a>.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-[#0b0000]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/icone.png" alt="Oliver Logo" className="h-6 w-6" />
            <span className="text-xl font-bold text-white">Oliver</span>
          </div>
          <p className="text-gray-600">© 2025 Oliver. Sistema profissional para gestão de orçamentos.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlansPage;
