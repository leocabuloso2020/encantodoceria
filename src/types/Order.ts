export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // Adicionado para exibir no admin
}

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_contact: string;
  customer_cpf?: string; // Adicionado: CPF do cliente (opcional inicialmente)
  total_amount: number;
  status: 'pending' | 'paid' | 'preparing' | 'delivered' | 'cancelled';
  items: OrderItem[];
  payment_method: string;
  user_id?: string; // Adicionado: ID do usuário que fez o pedido
}