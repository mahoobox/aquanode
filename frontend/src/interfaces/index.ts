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
  password?: string;
  email: string;
  role: string;
  updated_at?: string;
}

export interface Token {
  user_id: number;
  exp: number;
  name: string;
  last_name: string;
  role: string;
  avatar: File | null;
}

export interface Role {
	id?: number;
	name: string;
	created_at?: string;
	updated_at?: string;
}

export interface Events {
  id: number;
  events: string;
  url: string;
  observation: string;
  aprobbed: boolean;
  is_read: boolean;
  created_at?: string;
}

export interface Event {
  observation: string;
  aprobbed: boolean;
  user_id: number;
  updated_at?: string;
}
