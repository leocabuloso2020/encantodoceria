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
  total_amount: number;
  status: 'pending' | 'paid' | 'preparing' | 'delivered' | 'cancelled';
  items: OrderItem[];
  payment_method: string;
}