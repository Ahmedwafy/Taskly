// src/lib/endpoints.ts

type Endpoints = {
  auth: {
    login: string;
    logout: string;
    signUp: string;
    forgotPasswod: string;
  };

  userData: {
    userInfo: string;
    createNewProject: string;
    getAllProjects: string;
    // byId: (id: string) => string;
    // name: (name: string) => string;
  };
};

export const endPoints: Endpoints = {
  auth: {
    login: '/auth/v1/token?grant_type=password',
    logout: '/auth/v1/logout',
    signUp: '/auth/v1/signup',
    forgotPasswod: '/auth/v1/recover',
  },

  userData: {
    userInfo: '/auth/v1/user',
    createNewProject: '/rest/v1/projects',
    getAllProjects: '/rest/v1/rpc/get_projects',
    // byId: (id) => `/users/${id}`,
    // name: (name) => `/users/name/${name}`,
  },
} as const;
