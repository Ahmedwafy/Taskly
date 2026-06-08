// used in more than 1 place

export interface SignUpFormData {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword?: string | number;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordFormTypes {
  email: string;
}
