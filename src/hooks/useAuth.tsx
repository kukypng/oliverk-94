import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'manager' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  budget_limit: number | null;
  expiration_date: string;
  budget_warning_enabled: boolean;
  budget_warning_days: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { name: string; role?: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  updateEmail: (email: string) => Promise<{ error: any }>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showLoading } = useEnhancedToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching user profile for:', user.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      console.log('Profile loaded:', data);
      return data as UserProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache profile for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });

  useEffect(() => {
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        // Sempre atualiza o estado da sessão
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Trata redirecionamentos e notificações com base no evento, especialmente da página /verify
        if (window.location.pathname === '/verify') {
          switch (event) {
            case 'PASSWORD_RECOVERY':
              console.log('Token de recuperação de senha processado. Redirecionando...');
              // A sessão agora está ativa, então podemos redirecionar para o formulário de redefinição de senha.
              navigate('/reset-password', { replace: true });
              return; // Para o processamento posterior deste evento
            case 'USER_UPDATED':
              console.log('Confirmação de alteração de e-mail do usuário.');
              showSuccess({
                title: 'Email atualizado!',
                description: 'Seu endereço de e-mail foi confirmado com sucesso.',
              });
              navigate('/dashboard', { replace: true });
              return; // Para o processamento posterior deste evento
            case 'SIGNED_IN':
               console.log('Confirmação de cadastro bem-sucedida.');
               showSuccess({
                 title: 'Conta confirmada!',
                 description: 'Bem-vindo! Seu cadastro foi concluído.',
               });
               navigate('/dashboard', { replace: true });
               return; // Para o processamento posterior deste evento
            default:
              break;
          }
        }

        // Esta parte é executada para logins iniciais ou se não vier da página /verify
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              const { data: existingProfile } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', session.user.id)
                .single();

              if (!existingProfile) {
                console.log('Creating new user profile');
                const { error } = await supabase
                  .from('user_profiles')
                  .insert({
                    id: session.user.id,
                    name: session.user.user_metadata?.name || session.user.email || 'Usuário',
                    role: 'user',
                    expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true
                  });

                if (error) {
                  console.error('Error creating user profile:', error);
                }
              }
            } catch (error) {
              console.error('Error checking/creating user profile:', error);
            }
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, showSuccess]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const errorMessage = signInError.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos'
          : signInError.message;
        
        showError({
          title: 'Erro no login',
          description: errorMessage,
        });
        return { error: signInError };
      }

      if (signInData.user) {
        // Check user profile existence
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', signInData.user.id)
          .single();

        if (profileError || !profileData) {
          await supabase.auth.signOut();
          showError({
            title: 'Erro no login',
            description: 'Não foi possível verificar seu perfil. Contate o suporte.',
          });
          return { error: profileError || new Error('Profile not found') };
        }

        // Login is allowed even if the account is inactive.
        // AuthGuard and ProtectedRoute will handle redirection to the expired page.
        
        showSuccess({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando...'
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      showError({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro durante o login. Tente novamente.'
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; role?: string }) => {
    try {
      console.log('Attempting sign up for:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            role: userData.role || 'user'
          }
        }
      });
      
      if (error) {
        const errorMessage = error.message === 'User already registered'
          ? 'Usuário já cadastrado'
          : error.message;
          
        showError({
          title: 'Erro no cadastro',
          description: errorMessage,
          action: {
            label: 'Tentar Novamente',
            onClick: () => console.log('Retry signup clicked')
          }
        });
      } else {
        showSuccess({
          title: 'Cadastro realizado!',
          description: 'Verifique seu email para confirmar a conta.',
          duration: 6000
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      showError({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro durante o cadastro. Tente novamente.'
      });
      return { error };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      console.log('Requesting password reset for:', email);
      // Alterado para apontar para a nova página de verificação universal
      const redirectUrl = `${window.location.origin}/verify`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        showError({
          title: 'Erro ao solicitar',
          description: "Não foi possível enviar o link. Verifique o e-mail e tente novamente.",
        });
      } else {
        showSuccess({
          title: 'Link enviado!',
          description: 'Se o e-mail estiver cadastrado, um link de redefinição foi enviado.',
        });
      }
      return { error };
    } catch (error) {
      console.error('Password reset request error:', error);
      showError({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao solicitar a redefinição. Tente novamente.',
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      console.log('Attempting to update password.');
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        showError({
          title: 'Erro ao atualizar senha',
          description: error.message,
        });
      } else {
        showSuccess({
          title: 'Senha atualizada!',
          description: 'Sua senha foi alterada com sucesso.',
        });
      }
      return { error };
    } catch (error) {
      console.error('Password update error:', error);
      showError({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao atualizar sua senha. Tente novamente.',
      });
      return { error };
    }
  };

  const updateEmail = async (email: string) => {
    try {
      console.log('Attempting to update email to:', email);
      // Adicionado para apontar para a nova página de verificação universal
      const redirectUrl = `${window.location.origin}/verify`;
      const { error } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: redirectUrl }
      );

      if (error) {
        const errorMessage = error.message === 'New email address should be different from the current one.'
          ? 'O novo email deve ser diferente do atual.'
          : error.message;
        showError({
          title: 'Erro ao atualizar email',
          description: errorMessage,
        });
      } else {
        showSuccess({
          title: 'Confirmação enviada!',
          description: 'Verifique seu novo email para confirmar a alteração.',
        });
      }
      return { error };
    } catch (error) {
      console.error('Email update error:', error);
      showError({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao atualizar seu email. Tente novamente.',
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Redirect to auth page instead of reloading
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      showError({
        title: 'Erro no logout',
        description: 'Ocorreu um erro ao desconectar. Tente novamente.'
      });
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!profile) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      manager: 2,
      admin: 3,
    };
    
    return roleHierarchy[profile.role] >= roleHierarchy[role];
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    
    const permissions: Record<UserRole, string[]> = {
      user: ['view_own_budgets', 'create_budgets', 'edit_own_budgets'],
      manager: ['view_all_budgets', 'manage_clients', 'view_reports'],
      admin: ['manage_users', 'manage_system', 'view_analytics'],
    };
    
    // Get all permissions for current role and higher
    const userPermissions: string[] = [];
    Object.entries(permissions).forEach(([role, perms]) => {
      if (hasRole(role as UserRole)) {
        userPermissions.push(...perms);
      }
    });
    
    return userPermissions.includes(permission);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    updateEmail,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
