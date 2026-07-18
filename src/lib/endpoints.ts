// src/lib/endpoints.ts
type Endpoints = {
  auth: {
    login: string;
    logout: string;
    signUp: string;
    forgotPasswod: string;
    resetPassword: string;
    generateNewToken: string;
  };

  userData: {
    userInfo: string;
    createNewProject: string;
    getAllProjects: string;
  };

  project: {
    getProjectEpics: (
      projectId: string,
      limit: number,
      offset: number,
    ) => string;
    epicDetails: (projectId: string, epicId: string) => string;
    // getProjectTasks: (projectId: string, taskStatus: string) => string;
    getProjectTasks: string;
    createNewTask: string;
  };

  epic: {
    updateEpic: (epicId: string) => string;
    getEpicTasks: (epicId: string) => string;
  };

  task: {
    getSingleTaskDetails: (projectId: string, taskId: string) => string;
    updateTaskStatusDragAndDrop: (taskId: string) => string;
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
    resetPassword: '/auth/v1/user',
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
    getProjectEpics: (projectId, limit, offset) =>
      `/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
    epicDetails: (projectId, epicId) =>
      `/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
    // getProjectTasks: (projectId, taskStatus) =>
    //   `/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${taskStatus}`,
    getProjectTasks: `/rest/v1/project_tasks`,
    createNewTask: `/rest/v1/tasks`,
  },

  epic: {
    updateEpic: (epicId) => `/rest/v1/epics?id=eq.${epicId}`,
    getEpicTasks: (epicId) => `/rest/v1/project_tasks?epic_id=eq.${epicId}`,
  },

  task: {
    getSingleTaskDetails: (projectId, taskId) =>
      `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`,
    updateTaskStatusDragAndDrop: (taskId) => `/rest/v1/tasks?id=eq.${taskId}`,
  },

  createNewEpic: '/rest/v1/epics',
  updateProjectById: (projectId) => `/rest/v1/projects?id=eq.${projectId}`,
  projectMembers: (projectId) =>
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
} as const;
