import React, { useState } from 'react';
import { NewBudgetForm } from './NewBudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
export const NewBudgetContent = () => {
  const [showForm, setShowForm] = useState(false);
  if (showForm) {
    return <NewBudgetForm onBack={() => setShowForm(false)} />;
  }
  return <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Novo Orçamento</h1>
          
        </div>
      </div>

      <Card className="glass-card animate-slide-up card-hover">
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
            <Button onClick={() => setShowForm(true)} size="lg" className="btn-apple mobile-touch animate-bounce-subtle">
              <Plus className="mr-2 h-5 w-5" />
              Criar Orçamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};