
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const ResetPasswordPage = () => {
  const { requestPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTokenFlow, setIsTokenFlow] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Supabase redirects with the token in the URL fragment
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      setIsTokenFlow(true);
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    await requestPasswordReset(email);
    setLoading(false);
    // User feedback is handled by the toast in useAuth
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: `Erro ao atualizar a senha: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso! Você será redirecionado para o login.' });
      setTimeout(() => navigate('/auth'), 3000);
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    return (
      <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
        {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        {message.text}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-primary/10 p-4 relative overflow-hidden">
        <div className="absolute top-6 right-6 z-10">
            <ThemeToggle />
        </div>
        <div className="w-full max-w-md relative z-10">
            <div className="text-center mb-8">
                <Link to="/">
                    <img src="/icone.png" alt="Oliver Logo" className="w-20 h-20 mx-auto mb-4" />
                </Link>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {isTokenFlow ? 'Definir Nova Senha' : 'Redefinir Senha'}
                </h1>
            </div>

            <Card className="glass-card border-0 shadow-2xl backdrop-blur-xl">
                <CardHeader>
                    <CardDescription className="text-center">
                        {isTokenFlow 
                            ? 'Digite sua nova senha abaixo.' 
                            : 'Digite seu email para receber o link de redefinição.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderMessage()}
                    {isTokenFlow ? (
                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div className="space-y-3 relative">
                                <Label htmlFor="password">Nova Senha</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 text-base rounded-xl input-focus pr-12"
                                />
                                <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-12 text-base rounded-xl input-focus"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Atualizar Senha'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 text-base rounded-xl input-focus"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Enviar Link'}
                            </Button>
                        </form>
                    )}
                     <div className="text-center text-sm">
                        <Link to="/auth" className="underline text-muted-foreground hover:text-primary">
                            Voltar para o Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};
