export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  permissions_id: string;
  avatar?: File | string | null;
  created_at: string;
  updated_at: string;
}
