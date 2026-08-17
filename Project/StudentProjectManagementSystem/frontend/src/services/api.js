const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5093';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);

    if (res.status === 204) {
      return null;
    }

    let data = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.message || data.title || (data.errors && Object.values(data.errors).flat().join(', ')))) ||
        res.statusText ||
        'Request failed';
      throw new Error(errorMessage);
    }

    // Unwrap ApiResponse<T> if wrapped
    if (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'success')) {
      if (!data.success) {
        throw new Error(data.message || 'API request indicated failure');
      }
      return data.data;
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${config.method || 'GET'} ${url}:`, err);
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

// Project Allocation Service (FK: ProjectId, StudentId, FacultyId)
export const projectAllocationService = {
  getAll: () => api.get('/api/ProjectAllocation'),
  getById: (id) => api.get(`/api/ProjectAllocation/${id}`),
  create: (dto) => api.post('/api/ProjectAllocation', dto),
  update: (id, dto) => api.put(`/api/ProjectAllocation/${id}`, dto),
  delete: (id) => api.delete(`/api/ProjectAllocation/${id}`),
};

// Project Task Service (FK: ProjectAllocationId, TaskStatusId, TaskPriorityId)
export const projectTaskService = {
  getAll: () => api.get('/api/ProjectTask'),
  getById: (id) => api.get(`/api/ProjectTask/${id}`),
  create: (dto) => api.post('/api/ProjectTask', dto),
  update: (id, dto) => api.put(`/api/ProjectTask/${id}`, dto),
  delete: (id) => api.delete(`/api/ProjectTask/${id}`),
};

// Project Service
export const projectService = {
  getAll: () => api.get('/api/Project'),
  getById: (id) => api.get(`/api/Project/${id}`),
  create: (dto) => api.post('/api/Project', dto),
  update: (id, dto) => api.put(`/api/Project/${id}`, dto),
  delete: (id) => api.delete(`/api/Project/${id}`),
};

// User Service
export const userService = {
  getAll: () => api.get('/api/User'),
  getById: (id) => api.get(`/api/User/${id}`),
  create: (dto) => api.post('/api/User', dto),
  update: (id, dto) => api.put(`/api/User/${id}`, dto),
  delete: (id) => api.delete(`/api/User/${id}`),
};

// User Type Service
export const userTypeService = {
  getAll: () => api.get('/api/UserType'),
  getById: (id) => api.get(`/api/UserType/${id}`),
  create: (dto) => api.post('/api/UserType', dto),
  update: (id, dto) => api.put(`/api/UserType/${id}`, dto),
  delete: (id) => api.delete(`/api/UserType/${id}`),
};

// Role Service
export const roleService = {
  getAll: () => api.get('/api/Role'),
  getById: (id) => api.get(`/api/Role/${id}`),
  create: (dto) => api.post('/api/Role', dto),
  update: (id, dto) => api.put(`/api/Role/${id}`, dto),
  delete: (id) => api.delete(`/api/Role/${id}`),
};

// User Role Service
export const userRoleService = {
  getAll: () => api.get('/api/UserRole'),
  getById: (id) => api.get(`/api/UserRole/${id}`),
  create: (dto) => api.post('/api/UserRole', dto),
  update: (id, dto) => api.put(`/api/UserRole/${id}`, dto),
  delete: (id) => api.delete(`/api/UserRole/${id}`),
};

// Status Service
export const statusService = {
  getAll: () => api.get('/api/Status'),
  getById: (id) => api.get(`/api/Status/${id}`),
  create: (dto) => api.post('/api/Status', dto),
  update: (id, dto) => api.put(`/api/Status/${id}`, dto),
  delete: (id) => api.delete(`/api/Status/${id}`),
};

// Task Priority Service
export const priorityService = {
  getAll: () => api.get('/api/ProjectTaskPriority'),
  getById: (id) => api.get(`/api/ProjectTaskPriority/${id}`),
  create: (dto) => api.post('/api/ProjectTaskPriority', dto),
  update: (id, dto) => api.put(`/api/ProjectTaskPriority/${id}`, dto),
  delete: (id) => api.delete(`/api/ProjectTaskPriority/${id}`),
};

// Dashboard LINQ APIs Service
export const dashboardService = {
  getSummary: () => api.get('/api/Dashboard/summary'),
  getTotalStudents: () => api.get('/api/Dashboard/total-students'),
  getTotalFaculty: () => api.get('/api/Dashboard/total-faculty'),
  getTotalProjects: () => api.get('/api/Dashboard/total-projects'),
  getTasksByStatus: () => api.get('/api/Dashboard/tasks-by-status'),
  getTasksByPriority: () => api.get('/api/Dashboard/tasks-by-priority'),
  getFacultyWorkload: () => api.get('/api/Dashboard/faculty-workload'),
  getStudentTaskCount: () => api.get('/api/Dashboard/student-task-count'),
  getTopStudents: () => api.get('/api/Dashboard/top-students'),
  getBottomStudents: () => api.get('/api/Dashboard/bottom-students'),
  getOverdueTasks: () => api.get('/api/Dashboard/overdue-tasks'),
  getProjectDetails: () => api.get('/api/Dashboard/project-details'),
  getLowProgressProjects: () => api.get('/api/Dashboard/low-progress-projects'),
  getMonthlyCompletedTasks: () => api.get('/api/Dashboard/monthly-completed-tasks'),
  getRoleWiseActiveUsers: () => api.get('/api/Dashboard/role-wise-active-users'),
  getRoleUsers: () => api.get('/api/Dashboard/role-users'),
  getRolesMoreThan10Users: () => api.get('/api/Dashboard/roles-more-than-10-users'),
  getRoleStatistics: () => api.get('/api/Dashboard/role-statistics'),
  getTasksDueNext7Days: () => api.get('/api/Dashboard/tasks-due-next-7-days'),
  getTopProjectsByProgress: () => api.get('/api/Dashboard/top-projects-by-progress'),
  getProjectsZeroCompletedTasks: () => api.get('/api/Dashboard/projects-zero-completed-tasks'),
  getAverageProjectProgress: () => api.get('/api/Dashboard/average-project-progress'),
  getProjectsByProgressRange: () => api.get('/api/Dashboard/projects-by-progress-range'),
  getFacultyAverageProgress: () => api.get('/api/Dashboard/faculty-average-progress'),
  getStudentProjectProgress: () => api.get('/api/Dashboard/student-project-progress'),
  getProjectsEndingNext30Days: () => api.get('/api/Dashboard/projects-ending-next-30-days'),
  getTasksByStatusAndPriority: () => api.get('/api/Dashboard/tasks-by-status-and-priority'),
  getFacultyTaskStatistics: () => api.get('/api/Dashboard/faculty-task-statistics'),
  getStudentTaskStatistics: () => api.get('/api/Dashboard/student-task-statistics'),
  getProjectsAllTasksCompleted: () => api.get('/api/Dashboard/projects-all-tasks-completed'),
};
