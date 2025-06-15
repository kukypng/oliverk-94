
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, User, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

const AdminUserCreationForm = () => {
  const { signUp } = useAuth();
  const { showSuccess, showError } = useEnhancedToast();
  
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    licenseDays: 30,
    isActive: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isFormValid = 
    userForm.name.trim() && 
    userForm.email.trim() && 
    userForm.password.length >= 6 && 
    userForm.password === userForm.confirmPassword &&
    userForm.licenseDays > 0;

  const calculateExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + userForm.licenseDays);
    return date.toLocaleDateString('pt-BR');
  };

  const handleCreateUser = async () => {
    if (!isFormValid) return;

    setIsCreating(true);

    try {
      const { error } = await signUp(userForm.email, userForm.password, {
        name: userForm.name,
        role: userForm.role
      });

      if (error) {
        throw error;
      }

      showSuccess({
        title: 'Usuário criado com sucesso!',
        description: `${userForm.name} foi adicionado ao sistema com licença válida até ${calculateExpirationDate()}.`,
        duration: 6000
      });

      // Reset form
      setUserForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        licenseDays: 30,
        isActive: true
      });

    } catch (error: any) {
      console.error('Error creating user:', error);
      showError({
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'red', text: 'Fraca' };
    if (password.length < 8) return { strength: 'medium', color: 'orange', text: 'Média' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      return { strength: 'strong', color: 'green', text: 'Forte' };
    }
    return { strength: 'medium', color: 'orange', text: 'Média' };
  };

  const passwordStrength = getPasswordStrength(userForm.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-primary/10 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute top-6 left-6 z-10">
        <Link to="/dashboard/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Painel
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground text-lg">Criar novo usuário no sistema</p>
        </div>

        <Card className="glass-card animate-scale-in border-0 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
              <User className="h-6 w-6" />
              Criação de Usuário
            </CardTitle>
            <CardDescription className="text-base">
              Preencha os dados para criar um novo usuário no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome completo do usuário"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="h-12 text-base rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="h-12 text-base rounded-xl"
                />
              </div>

              {/* Senha */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha do usuário"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="h-12 text-base rounded-xl pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {userForm.password && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full bg-${passwordStrength.color}-500`}></div>
                    <span>Força da senha: {passwordStrength.text}</span>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme a senha"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                    className="h-12 text-base rounded-xl pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {userForm.confirmPassword && userForm.password !== userForm.confirmPassword && (
                  <p className="text-xs text-red-500">As senhas não coincidem</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-medium">Nível de Acesso</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Selecione o nível de acesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dias de Licença */}
              <div className="space-y-3">
                <Label htmlFor="licenseDays" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Validade da Licença (dias)
                </Label>
                <Input
                  id="licenseDays"
                  type="number"
                  min="1"
                  max="3650"
                  placeholder="30"
                  value={userForm.licenseDays}
                  onChange={(e) => setUserForm({ ...userForm, licenseDays: parseInt(e.target.value) || 30 })}
                  className="h-12 text-base rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Licença válida até: <span className="font-medium">{calculateExpirationDate()}</span>
                </p>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isActive" className="text-sm font-medium">Conta Ativa</Label>
                  <p className="text-xs text-muted-foreground">
                    Usuário poderá acessar o sistema imediatamente
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={userForm.isActive}
                  onCheckedChange={(checked) => setUserForm({ ...userForm, isActive: checked })}
                />
              </div>

              {/* Botão de Criar */}
              <Button
                onClick={handleCreateUser}
                disabled={!isFormValid || isCreating}
                className="w-full h-12 text-base rounded-xl"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando Usuário...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Criar Usuário
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
          <p>
            <Link to="/dashboard/admin" className="font-semibold text-primary hover:underline">
              ← Voltar ao Painel Administrativo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const SignUpPage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminUserCreationForm />
    </ProtectedRoute>
  );
};
