
import React, { useState } from 'react';
import { NewBudgetForm } from './NewBudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Users, Clock } from 'lucide-react';

export const NewBudgetContent = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <NewBudgetForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Novo Orçamento</h1>
          <p className="text-muted-foreground mt-2">Crie um novo orçamento para seu cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos Hoje</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">2 aprovados</p>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">15min</div>
            <p className="text-xs text-muted-foreground">Por orçamento</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Criar Novo Orçamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Pronto para começar?</h3>
            <p className="text-muted-foreground mb-6">
              Crie um orçamento detalhado para seu cliente em poucos minutos
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              size="lg"
              className="btn-apple mobile-touch animate-bounce-subtle"
            >
              <Plus className="mr-2 h-5 w-5" />
              Criar Orçamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
