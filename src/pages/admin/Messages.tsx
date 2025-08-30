import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2, MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMessages, useUpdateMessage, useDeleteMessage } from '@/hooks/use-messages';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const AdminMessages = () => {
  const { data: messages, isLoading, isError, error } = useMessages();
  const updateMessageMutation = useUpdateMessage();
  const deleteMessageMutation = useDeleteMessage();

  const handleToggleApproval = async (messageId: number, currentStatus: boolean) => {
    await updateMessageMutation.mutateAsync({ id: messageId, approved: !currentStatus });
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      await deleteMessageMutation.mutateAsync(messageId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
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
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar mensagens: {error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gerenciar Mensagens</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead className="text-center">Aprovado</TableHead>
              <TableHead className="text-right">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.author_name}</TableCell>
                <TableCell>{message.author_email || 'N/A'}</TableCell>
                <TableCell className="max-w-[200px] truncate">{message.message}</TableCell>
                <TableCell className="text-center">
                  {message.approved ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleApproval(message.id, message.approved)}>
                        {message.approved ? 'Desaprovar' : 'Aprovar'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMessage(message.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {messages?.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Nenhuma mensagem encontrada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMessages;