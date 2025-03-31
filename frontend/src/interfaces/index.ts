export interface NewError extends Error {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export interface User {
  id?: number;
  name: string;
  last_name: string;
  password: string;
  email: string;
  register_number: string;
  identification_card: string;
  role: string;
  company_name: string;
  avatar: File | null;
}

export interface Token {
  user_id: number;
  exp: number;
  name: string;
  last_name: string;
  role: string;
  company: string;
  avatar: File | null;
}

export interface Role {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}