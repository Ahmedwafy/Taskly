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
}

export interface ResetPasswordPayload {
  password: string;
}
