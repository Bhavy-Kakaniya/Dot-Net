const roles = [
  {
    id: 1,
    name: 'Administrator',
    StatusName: 'Full system access with all permissions',
    permissions: ['users.read', 'users.write', 'roles.read', 'roles.write', 'projects.read', 'projects.write', 'tasks.read', 'tasks.write', 'reports.read'],
    userCount: 1,
    createdAt: '2022-01-01',
  },
  {
    id: 2,
    name: 'Faculty Advisor',
    StatusName: 'Manage projects and supervise student tasks',
    permissions: ['projects.read', 'projects.write', 'tasks.read', 'tasks.write', 'reports.read'],
    userCount: 2,
    createdAt: '2022-03-15',
  },
  {
    id: 3,
    name: 'Student',
    StatusName: 'View and update assigned projects and tasks',
    permissions: ['projects.read', 'tasks.read', 'tasks.write'],
    userCount: 5,
    createdAt: '2022-03-15',
  },
  {
    id: 4,
    name: 'Project Manager',
    StatusName: 'Oversee project lifecycle and team assignments',
    permissions: ['projects.read', 'projects.write', 'tasks.read', 'tasks.write', 'users.read'],
    userCount: 0,
    createdAt: '2023-06-01',
  },
  {
    id: 5,
    name: 'Viewer',
    StatusName: 'Read-only access to projects and reports',
    permissions: ['projects.read', 'tasks.read', 'reports.read'],
    userCount: 0,
    createdAt: '2024-01-10',
  },
];

export default roles;
