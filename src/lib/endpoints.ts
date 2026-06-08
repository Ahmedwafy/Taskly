// src/lib/endpoints.ts

type Endpoints = {
  auth: {
    login: string;
    logout: string;
    signUp: string;
    forgotPasswod: string;
  };

  //   users: {
  //     byId: (id: string) => string;
  //     name: (name: string) => string;
  //   };
};

export const endPoints: Endpoints = {
  auth: {
    login: '/auth/v1/token?grant_type=password',
    logout: '',
    signUp: '',
    forgotPasswod: '',
  },

  //   users: {
  //     byId: (id) => `/users/${id}`,
  //     name: (name) => `/users/name/${name}`,
  //   },
} as const;
