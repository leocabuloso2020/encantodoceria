import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { i18n } from '@supabase/auth-ui-shared/dist/i18n'; // Caminho corrigido para o i18n
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Check if the user is an admin
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              toast.error('Erro ao carregar perfil do usuário.');
              supabase.auth.signOut(); // Sign out if profile cannot be fetched
              return;
            }
            if (data?.is_admin) {
              navigate('/admin');
              toast.success('Login de administrador realizado com sucesso!');
            } else {
              toast.error('Acesso restrito. Você não tem permissões de administrador.');
              supabase.auth.signOut(); // Sign out if not admin
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary-soft p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border/50">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8 font-dancing gradient-text">
          Doces da Paty - Admin
        </h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-hover))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--muted-foreground))',
                  anchorTextColor: 'hsl(var(--primary))',
                  anchorTextHoverColor: 'hsl(var(--primary-hover))',
                },
              },
            },
          }}
          theme="light"
          localization={i18n.locales.pt} // Usa o objeto de localização em português
          redirectTo={window.location.origin + '/admin'} // Redirect to admin after successful login
        />
      </div>
    </div>
  );
};

export default Login;