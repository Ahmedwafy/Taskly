// used in more than 1 place

export interface SignUpFormData {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword?: string | number;
}
// --------------------------------
export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
// --------------------------------
export interface ForgotPasswordFormTypes {
  email: string;
}
// --------------------------------
export interface ProjectProps {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}
// --------------------------------
export interface UserDetails {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface ProjectEpic {
  id: string; // epic id
  epic_id: string;
  title: string;
  description: string | null;
  deadline: string;
  created_at: string;
  created_by: UserDetails;
  assignee: UserDetails;
}
// --------------------------------
