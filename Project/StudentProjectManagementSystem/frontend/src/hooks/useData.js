'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import initialUsers from '@/data/users';
import initialRoles from '@/data/roles';
import initialUserRoles from '@/data/userRoles';
import initialProjects from '@/data/projects';
import initialTasks from '@/data/tasks';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);

  const getNextId = (items) => Math.max(0, ...items.map((i) => i.id)) + 1;

  const addUser = useCallback((user) => {
    const newUser = { ...user, id: getNextId(users) };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, [users]);

  const updateUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addRole = useCallback((role) => {
    const newRole = { ...role, id: getNextId(roles), userCount: 0, createdAt: new Date().toISOString().split('T')[0] };
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  }, [roles]);

  const updateRole = useCallback((id, updates) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteRole = useCallback((id) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const assignRole = useCallback((assignment) => {
    const newAssignment = { ...assignment, id: getNextId(userRoles), assignedAt: new Date().toISOString().split('T')[0] };
    setUserRoles((prev) => [...prev, newAssignment]);
    return newAssignment;
  }, [userRoles]);

  const removeRoleAssignment = useCallback((id) => {
    setUserRoles((prev) => prev.filter((ur) => ur.id !== id));
  }, []);

  const addProject = useCallback((project) => {
    const newProject = { ...project, id: getNextId(projects) };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, [projects]);

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addTask = useCallback((task) => {
    const newTask = { ...task, id: getNextId(tasks), createdAt: new Date().toISOString().split('T')[0] };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [tasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getUserById = useCallback((id) => users.find((u) => u.id === id), [users]);
  const getRoleById = useCallback((id) => roles.find((r) => r.id === id), [roles]);
  const getProjectById = useCallback((id) => projects.find((p) => p.id === id), [projects]);
  const getTaskById = useCallback((id) => tasks.find((t) => t.id === id), [tasks]);

  return (
    <DataContext.Provider
      value={{
        users,
        roles,
        userRoles,
        projects,
        tasks,
        addUser,
        updateUser,
        deleteUser,
        addRole,
        updateRole,
        deleteRole,
        assignRole,
        removeRoleAssignment,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        getUserById,
        getRoleById,
        getProjectById,
        getTaskById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
