import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Objeto de localização em português definido diretamente
const ptLocalization = {
  variables: {
    sign_in: {
      email_label: 'Seu e-mail',
      password_label: 'Sua senha',
      email_input_placeholder: 'Digite seu e-mail',
      password_input_placeholder: 'Digite sua senha',
      button_label: 'Entrar',
      loading_button_label: 'Entrando...',
      social_provider_text: 'Entrar com {{provider}}',
      link_text: 'Já tem uma conta? Entrar',
    },
    sign_up: {
      email_label: 'Seu e-mail',
      password_label: 'Crie uma senha',
      email_input_placeholder: 'Digite seu e-mail',
      password_input_placeholder: 'Crie sua senha',
      button_label: 'Cadastrar',
      loading_button_label: 'Cadastrando...',
      social_provider_text: 'Cadastrar com {{provider}}',
      link_text: 'Não tem uma conta? Cadastre-se',
    },
    forgotten_password: {
      email_label: 'Seu e-mail',
      email_input_placeholder: 'Digite seu e-mail para redefinir a senha',
      button_label: 'Enviar instruções de redefinição',
      loading_button_label: 'Enviando...',
      link_text: 'Esqueceu sua senha?',
    },
    update_password: {
      password_label: 'Nova senha',
      password_input_placeholder: 'Digite sua nova senha',
      button_label: 'Atualizar senha',
      loading_button_label: 'Atualizando...',
    },
  },
  messages: {
    sign_in_email_label: 'Endereço de e-mail',
    sign_in_password_label: 'Senha',
    sign_in_email_placeholder: 'Seu endereço de e-mail',
    sign_in_password_placeholder: 'Sua senha',
    sign_in_button_label: 'Entrar',
    sign_in_social_provider_text: 'Entrar com {{provider}}',
    sign_up_email_label: 'Endereço de e-mail',
    sign_up_password_label: 'Criar uma senha',
    sign_up_email_placeholder: 'Seu endereço de e-mail',
    sign_up_password_placeholder: 'Sua senha',
    sign_up_button_label: 'Cadastrar',
    sign_up_social_provider_text: 'Cadastrar com {{provider}}',
    forgotten_password_email_label: 'Endereço de e-mail',
    forgotten_password_email_placeholder: 'Seu endereço de e-mail',
    forgotten_password_button_label: 'Enviar instruções de redefinição',
    forgotten_password_link_text: 'Esqueceu sua senha?',
    update_password_password_label: 'Nova senha',
    update_password_password_placeholder: 'Sua nova senha',
    update_password_button_label: 'Atualizar senha',
    // Adicione outras mensagens conforme necessário
  },
};

const Login = () => {
  // Removido o useEffect com onAuthStateChange daqui.
  // A SessionContextProvider agora é responsável por gerenciar o estado de autenticação e redirecionamentos.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary-soft p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border/50">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8 font-dancing gradient-text">
          Doces da Paty - Login
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
          localization={ptLocalization} // Usa o objeto de localização em português definido localmente
          // REMOVIDO: redirectTo={window.location.origin + '/'}
        />
      </div>
    </div>
  );
};

export default Login;