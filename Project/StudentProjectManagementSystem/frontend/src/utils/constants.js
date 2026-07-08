export const APP_NAME = 'Student Project Management System';

export const USER_TYPES = ['Student', 'Faculty', 'Admin'];

export const USER_STATUSES = ['Active', 'Inactive', 'Pending'];

export const PROJECT_STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

export const TASK_STATUSES = ['To Do', 'In Progress', 'Review', 'Done', 'Blocked'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const ROLE_PERMISSIONS = [
  'users.read',
  'users.write',
  'roles.read',
  'roles.write',
  'projects.read',
  'projects.write',
  'tasks.read',
  'tasks.write',
  'reports.read',
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export const DEMO_CREDENTIALS = {
  email: 'admin@spms.edu',
  password: 'admin123',
};

export const SIDEBAR_WIDTH = 260;

export const STATUS_COLORS = {
  Active: 'success',
  Inactive: 'default',
  Pending: 'warning',
  Planning: 'info',
  'In Progress': 'primary',
  'On Hold': 'warning',
  Completed: 'success',
  Cancelled: 'error',
  'To Do': 'default',
  Review: 'info',
  Done: 'success',
  Blocked: 'error',
  Low: 'default',
  Medium: 'info',
  High: 'warning',
  Critical: 'error',
};
