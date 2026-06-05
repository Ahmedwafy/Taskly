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
}

export interface ForgotPasswordFormTypes {
  email: string;
}
