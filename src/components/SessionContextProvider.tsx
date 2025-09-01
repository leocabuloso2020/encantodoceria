import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);

      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        // Se houver um erro, mas não for 'PGRST116' (nenhuma linha encontrada), então é um erro crítico.
        // Caso contrário, se for 'PGRST116' ou nenhum erro, tratamos como perfil não encontrado ou encontrado.
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          toast.error('Erro ao carregar perfil do usuário.');
          setIsAdmin(false);
          await supabase.auth.signOut(); // Desloga apenas em erros críticos de perfil
          navigate('/login');
        } else {
          // Se não houve erro ou o erro foi 'PGRST116' (perfil não encontrado),
          // assume que não é admin por padrão ou usa o valor do perfil.
          setIsAdmin(profile?.is_admin || false);
          if (profile?.is_admin && location.pathname === '/login') {
            navigate('/admin');
          } else if (!profile?.is_admin && location.pathname.startsWith('/admin')) {
            toast.error('Acesso restrito. Você não tem permissões de administrador.');
            await supabase.auth.signOut(); // Desloga se tentar acessar admin sem ser admin
            navigate('/login');
          }
        }
      } else {
        setIsAdmin(false);
        if (location.pathname.startsWith('/admin')) {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile on auth state change:', error);
              toast.error('Erro ao carregar perfil do usuário.');
              setIsAdmin(false);
              supabase.auth.signOut();
              navigate('/login');
            } else {
              setIsAdmin(data?.is_admin || false);
              if (data?.is_admin && location.pathname === '/login') {
                navigate('/admin');
              } else if (!data?.is_admin && location.pathname.startsWith('/admin')) {
                toast.error('Acesso restrito. Você não tem permissões de administrador.');
                supabase.auth.signOut();
                navigate('/login');
              }
            }
          });
      } else {
        setIsAdmin(false);
        if (location.pathname.startsWith('/admin')) {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <SessionContext.Provider value={{ session, user, isAdmin, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};