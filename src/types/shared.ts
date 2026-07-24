// used in more than 1 place

export interface SignUpFormData {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword?: string | number;
}
// ====================================================
export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
// ====================================================
export interface ForgotPasswordFormTypes {
  email: string;
}
// ====================================================
export interface ProjectProps {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}
// ====================================================
export interface UserDetails {
  sub: string;
  name: string;
  email: string;
  department: string;
}
export interface ProjectEpic {
  id: string; // epic id
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
  deadline: string;
  epic_id: string;
  created_by: UserDetails;
  assignee: UserDetails;
}
// ====================================================
export interface UpdateEpicPayload {
  title?: string;
  description?: string;
  assignee_id?: string | null;
  deadline?: string | null;
}
export interface UpdateEpicArgs {
  epicId: string;
  payload: UpdateEpicPayload;
}
// ====================================================
export interface UserProfile {
  name?: string;
  avatar_url?: string;
}
export interface EpicDetails {
  id: string;
  epic_id?: string;
  title?: string;
  description?: string;
  created_by?: UserProfile;
  assignee?: UserProfile;
  deadline?: string | null;
  created_at?: string;
}
// ====================================================
export interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    sub: string;
    name: string;
    email: string;
    department?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    avatar_url?: string;
  };
}
//====================================================
// export interface FetchProjectEpicsParams {
//   projectId: string;
//   limit: number;
//   offset: number;
//   searchTerm?: string;
//   accessToken: string;
// }
export interface GetProjectEpicsParams {
  projectId: string;
  limit: number;
  offset: number;
  searchTerm?: string;
}
export interface FetchProjectEpicsParams extends GetProjectEpicsParams {
  accessToken: string;
}
