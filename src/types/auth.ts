export interface SignUpPayload {
  email: string;
  password: string;
  data: {
    name: string;
    department: string;
  };
}

export interface SignInPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordPayload {
  password: string;
}

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  department?: string;
  role?: string;
  [key: string]: unknown;
}
