import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, XCircle, Trash2 } from 'lucide-react'; // Adicionado Trash2
import { Skeleton } from '@/components/ui/skeleton';

const AdminMessages = () => {
  // Mock data for now, will be replaced with actual data fetching later
  const messages = [
    { id: 1, author_name: "Maria Silva", author_email: "maria@example.com", message: "Adorei as trufas! São deliciosas.", approved: true, created_at: "2024-07-20T10:00:00Z" },
    { id: 2, author_name: "João Souza", author_email: "joao@example.com", message: "Gostaria de saber se fazem entrega em Contagem.", approved: false, created_at: "2024-07-19T15:30:00Z" },
    { id: 3, author_name: "Ana Paula", author_email: "ana@example.com", message: "Qual o prazo de validade das trufas?", approved: true, created_at: "2024-07-18T09:45:00Z" },
  ];

  const isLoading = false; // Placeholder for loading state
  const isError = false; // Placeholder for error state

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
          <p className="text-destructive">Erro ao carregar mensagens.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gerenciar Mensagens</CardTitle>
        {/* Botão para adicionar nova mensagem ou filtrar, se necessário */}
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
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.author_name}</TableCell>
                <TableCell>{message.author_email}</TableCell>
                <TableCell className="max-w-[200px] truncate">{message.message}</TableCell>
                <TableCell className="text-center">
                  {message.approved ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(message.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="sr-only">Aprovar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Nenhuma mensagem encontrada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMessages;