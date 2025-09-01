import { useAdminMessages } from '@/hooks/use-admin-messages';
import { useUpdateMessageStatus, useDeleteMessage } from '@/hooks/use-message-mutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageSquareText, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminMessages = () => {
  const { data: messages, isLoading, isError, error } = useAdminMessages();
  const updateMessageStatusMutation = useUpdateMessageStatus();
  const deleteMessageMutation = useDeleteMessage();

  const handleToggleApproval = async (messageId: number, currentStatus: boolean) => {
    await updateMessageStatusMutation.mutateAsync({ messageId, approved: !currentStatus });
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
          <CardTitle>Mensagens dos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
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
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <MessageSquareText className="h-6 w-6 text-primary" />
          <span>Gerenciar Mensagens Doces</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">
                  {message.author_name}
                  {message.author_email && (
                    <p className="text-xs text-muted-foreground">{message.author_email}</p>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={message.approved ? 'default' : 'secondary'}>
                    {message.approved ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {message.approved ? 'Aprovada' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(message.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 mr-2"
                    onClick={() => handleToggleApproval(message.id, message.approved)}
                    disabled={updateMessageStatusMutation.isPending}
                  >
                    {message.approved ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="sr-only">{message.approved ? 'Desaprovar' : 'Aprovar'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteMessage(message.id)}
                    disabled={deleteMessageMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
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