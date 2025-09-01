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

// O esquema usa `z.string().transform` para converter strings vazias em `null`,
// `refine` para validar o comprimento apenas se o valor não for `null`,
// e uma asserção de tipo (`as z.ZodType<string | null>`) para garantir a inferência correta.
const profileSchema = z.object({
  first_name: z.string()
    .transform(val => val.trim() === '' ? null : val.trim()) // Converte string vazia para null
    .refine(val => val === null || val.length >= 2, { // Valida comprimento se não for null
      message: "O primeiro nome deve ter pelo menos 2 caracteres."
    }) as z.ZodType<string | null>, // Garante que o tipo inferido seja string | null
  last_name: z.string()
    .transform(val => val.trim() === '' ? null : val.trim()) // Converte string vazia para null
    .refine(val => val === null || val.length >= 2, { // Valida comprimento se não for null
      message: "O sobrenome deve ter pelo menos 2 caracteres."
    }) as z.ZodType<string | null>, // Garante que o tipo inferido seja string | null
});

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