export interface Message {
  id: number;
  author_name: string;
  author_email: string | null;
  message: string;
  approved: boolean;
  created_at: string;
}