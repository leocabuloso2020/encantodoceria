export interface Message {
  id: number;
  created_at: string;
  author_name: string;
  author_email: string | null;
  message: string;
  approved: boolean;
}