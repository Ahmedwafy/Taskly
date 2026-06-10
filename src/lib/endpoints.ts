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
    // byId: (id: string) => string;
    // name: (name: string) => string;
  };
};

export const endPoints: Endpoints = {
  auth: {
    login: '/auth/v1/token?grant_type=password',
    logout: '',
    signUp: '/auth/v1/signup',
    forgotPasswod: '/auth/v1/recover',
  },

  userData: {
    userInfo: '/auth/v1/user',
    // byId: (id) => `/users/${id}`,
    // name: (name) => `/users/name/${name}`,
  },
} as const;
