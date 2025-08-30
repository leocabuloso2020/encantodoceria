import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { pt } from '@supabase/auth-ui-shared/dist/i18n/locales/pt'; // Caminho corrigido para o mais comum e robusto
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
            theme:<dyad-problem-report summary="1 problems">
<problem file="src/pages/Login.tsx" line="3" column="22" code="2307">Cannot find module '@supabase/auth-ui-shared/i18n' or its corresponding type declarations.</problem>
</dyad-problem-report><think>**Examining the Error**

I'm still grappling with the TypeScript error related to the '@supabase/auth-ui-shared/i18n' module. Earlier attempts to import from different subpaths proved fruitless. I'm now investigating potential solutions, such as configuring module resolution paths or ensuring the library is correctly installed within the project environment. It appears the root cause may lie in how the project references dependencies.


**Refining the Approach**

I'm revisiting the import issue. After reviewing the package structure, I'm trying a more direct approach: `import { i18n } from '@supabase/auth-ui-shared';` followed by `localization={i18n.locales.pt}`. While similar attempts failed, a deeper look suggests potential caching or build issues. I'll propose a refresh and rebuild if this doesn't resolve the problem.


**Confirming the Import**

I'm focusing again on the direct import from the root, `import { i18n } from '@supabase/auth-ui-shared';` and then using `i18n.locales.pt`. It's the standard, as per the documentation, and I'm re-validating the package installation. If this doesn't succeed, I'll suggest a deeper look at the module resolution configurations within the project to ensure proper pathing.


**Investigating Package Updates**

I'm now focusing on a potential package version mismatch. Given the persistent import issue, updating `@supabase/auth-ui-react` and `@supabase/auth-ui-shared` to their latest versions seems crucial. The current versions might not align with the expected import structure or have known module resolution bugs. I'll test the updated packages to see if it clears the path.


**Verifying Dependency Updates**

I'm now focusing on a potential package version issue. After thoroughly analyzing the documentation and existing code, I've identified that the current versions of `@supabase/auth-ui-react` and `@supabase/auth-ui-shared` are significantly outdated. The proposed solution involves updating these dependencies to their latest stable versions and then re-attempting the direct import of `i18n` from `@supabase/auth-ui-shared` and using `localization={i18n.locales.pt}` in the `Login.tsx` file. A rebuild is also recommended to ensure the changes are correctly reflected. This comprehensive update aims to resolve any module resolution issues stemming from package incompatibility.


</think>Com certeza! Peço desculpas pela persistência desse erro de importação. Parece que as versões atuais das bibliotecas `@supabase/auth-ui-react` e `@supabase/auth-ui-shared` podem estar causando o problema de resolução do módulo `i18n`.

A solução mais robusta é atualizar essas bibliotecas para suas versões mais recentes e, em seguida, usar o método de importação padrão para a localização.

Primeiro, vou atualizar as dependências:
<dyad-add-dependency packages="@supabase/auth-ui-react@latest @supabase/auth-ui-shared@latest"></dyad-add-dependency>

Em seguida, vou corrigir o arquivo `src/pages/Login.tsx` para usar a importação padrão do objeto `i18n` e a localização em português.

<dyad-write path="src/pages/Login.tsx" description="Atualizando as dependências do Supabase Auth UI e corrigindo a importação da localização em português no Login.tsx.">
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { i18n } from '@supabase/auth-ui-shared'; // Importa o objeto i18n da raiz do pacote
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