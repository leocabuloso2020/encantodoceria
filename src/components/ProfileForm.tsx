import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserProfile, useUpdateUserProfile, UpdateProfilePayload } from "@/hooks/use-profile";
import React from "react";
import { Loader2 } from "lucide-react";

// O esquema usa `z.preprocess` para converter strings vazias em `null` antes da validação.
// Em seguida, `z.string().min(2).nullable()` garante que o campo seja `string | null`
// e não opcional.
// A anotação de tipo explícita `z.ZodType<ProfileFormValues>` foi removida para permitir
// que o Zod infira o tipo corretamente.
const profileSchema = z.object({
  first_name: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '') ? null : val, // Converte string vazia para null
    z.string().min(2, { message: "O primeiro nome deve ter pelo menos 2 caracteres." }).nullable() // Valida como string ou null (não opcional)
  ),
  last_name: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '') ? null : val, // Converte string vazia para null
    z.string().min(2, { message: "O sobrenome deve ter pelo menos 2 caracteres." }).nullable() // Valida como string ou null (não opcional)
  ),
});

// Define o tipo dos valores do formulário a partir da inferência do Zod
type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: UserProfile;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const updateProfileMutation = useUpdateUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
    },
  });

  React.useEffect(() => {
    form.reset({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
    });
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    // 'values' agora terá 'first_name' e 'last_name' como 'string | null',
    // correspondendo a UpdateProfilePayload.
    await updateProfileMutation.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primeiro Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu primeiro nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input placeholder="Seu sobrenome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;