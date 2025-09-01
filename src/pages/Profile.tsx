import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator"; // Importação adicionada
import { useUserProfile } from "@/hooks/use-profile";
import ProfileForm from "@/components/ProfileForm";

const Profile = () => {
  const { user, loading: sessionLoading } = useSession();
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: profileError } = useUserProfile();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      toast.info("Você precisa estar logado para ver seu perfil.");
      navigate('/login');
    }
  }, [sessionLoading, user, navigate]);

  if (sessionLoading || (!user && !sessionLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground font-dancing gradient-text">Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isErrorProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-destructive">Erro ao carregar perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Não foi possível carregar seus dados de perfil. Por favor, tente novamente mais tarde.
                <br />
                Detalhes do erro: {profileError?.message}
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground font-dancing gradient-text">Meu Perfil</CardTitle>
            <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-foreground font-medium">Email: <span className="text-muted-foreground">{user?.email}</span></p>
              </div>
              {profile && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary" />
                  <p className="text-foreground font-medium">Nome Completo: <span className="text-muted-foreground">{profile.first_name} {profile.last_name}</span></p>
                </div>
              )}
            </div>
            <Separator />
            <h3 className="text-xl font-semibold text-foreground mb-4">Editar Informações</h3>
            {profile && <ProfileForm profile={profile} />}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;