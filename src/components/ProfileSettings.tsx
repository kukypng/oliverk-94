
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { User, Save } from 'lucide-react';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica para salvar os dados do perfil no Supabase
      toast.success("Perfil atualizado", {
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast.error("Erro ao salvar", {
        description: "Ocorreu um erro ao salvar suas informações.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <User className="h-5 w-5 mr-2 text-primary" />
          Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={formData.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardContent>
    </Card>
  );
};
