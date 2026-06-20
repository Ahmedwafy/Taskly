// src/lib/endpoints.ts

type Endpoints = {
  auth: {
    login: string;
    logout: string;
    signUp: string;
    forgotPasswod: string;
    generateNewToken: string;
  };

  userData: {
    userInfo: string;
    createNewProject: string;
    getAllProjects: string;
    // getProjectByID: (id: string) => string;
    // name: (name: string) => string;
  };

  updateProjectById: (projectId: string) => string;
  projectMembers: (projectId: string) => string;
  createNewEpic: string;
};

export const endPoints: Endpoints = {
  auth: {
    login: '/auth/v1/token?grant_type=password',
    logout: '/auth/v1/logout',
    signUp: '/auth/v1/signup',
    forgotPasswod: '/auth/v1/recover',
    generateNewToken: '/auth/v1/token?grant_type=refresh_token',
  },

  userData: {
    userInfo: '/auth/v1/user',
    createNewProject: '/rest/v1/projects',
    getAllProjects: '/rest/v1/rpc/get_projects',
    // getProjectByID: (id) => `/${id}`,
    // name: (name) => `/users/name/${name}`,
  },

  createNewEpic: '/rest/v1/epics',
  updateProjectById: (projectId) => `/rest/v1/projects?id=eq.${projectId}`,
  projectMembers: (projectId) =>
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
} as const;
