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
  project: {
    getProjectEpics: (
      projectId: string,
      limit: number,
      offset: number,
    ) => string;
    epicDetails: (projectId: string, epicId: string) => string;
    createNewTask: string;
  };

  epic: {
    updateEpic: (epicId: string) => string;
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

  project: {
    // getProjectEpics: `/rest/v1/project_epics?project_id=eq.`,
    getProjectEpics: (projectId, limit, offset) =>
      `/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
    epicDetails: (projectId, epicId) =>
      `/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
    createNewTask: `/rest/v1/tasks`,
  },

  epic: {
    updateEpic: (epicId) => `/rest/v1/epics?id=eq.${epicId}`,
  },

  createNewEpic: '/rest/v1/epics',
  updateProjectById: (projectId) => `/rest/v1/projects?id=eq.${projectId}`,
  projectMembers: (projectId) =>
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
} as const;
