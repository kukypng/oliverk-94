
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const SignUpPage = () => {
  const [signupForm, setSignupForm] = useState({
    email: '',
    name: ''
  });

  const isFormInvalid = !signupForm.name || !signupForm.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-primary/10 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <img src="/icone.png" alt="Oliver Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Oliver</h1>
          <p className="text-muted-foreground text-lg">Crie sua conta</p>
        </div>

        <Card className="glass-card animate-scale-in border-0 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-foreground">Cadastro e Assinatura</CardTitle>
            <CardDescription className="text-base">
              Preencha seus dados para iniciar a assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="signup-name" className="text-sm font-medium">Nome Completo</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                  className="h-12 text-base rounded-xl input-focus mobile-touch"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  required
                  className="h-12 text-base rounded-xl input-focus mobile-touch"
                />
              </div>
              
              {/* O botão de pagamento foi removido. Esta página será transformada em um painel de criação de usuário para administradores. */}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
          <p>
            <Link to="/auth" className="font-semibold text-primary hover:underline">Já tem uma conta? Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
