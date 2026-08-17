'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialUsers from '@/data/users';
import initialRoles from '@/data/roles';
import initialUserRoles from '@/data/userRoles';
import initialProjects from '@/data/projects';
import initialTasks from '@/data/tasks';
import { userService, roleService, userRoleService, projectService, projectTaskService, projectAllocationService } from '@/services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [userRoles, setUserRoles] = useState(initialUserRoles);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [uData, rData, urData, pData, tData, aData] = await Promise.all([
        userService.getAll().catch(() => null),
        roleService.getAll().catch(() => null),
        userRoleService.getAll().catch(() => null),
        projectService.getAll().catch(() => null),
        projectTaskService.getAll().catch(() => null),
        projectAllocationService.getAll().catch(() => null),
      ]);

      if (uData && Array.isArray(uData)) {
        setUsers(
          uData.map((u) => ({
            ...u,
            id: u.userId,
            name: u.fullName,
            phone: u.mobileNumber,
            status: u.isActive ? 'Active' : 'Inactive',
          }))
        );
      }

      if (rData && Array.isArray(rData)) {
        setRoles(
          rData.map((r) => ({
            ...r,
            id: r.roleId,
            name: r.roleName,
            permissions: [],
          }))
        );
      }

      if (urData && Array.isArray(urData)) {
        setUserRoles(
          urData.map((ur) => ({
            ...ur,
            id: ur.rolePermissionId,
          }))
        );
      }

      if (pData && Array.isArray(pData)) {
        setProjects(
          pData.map((p) => ({
            ...p,
            id: p.projectId,
            title: p.projectTitle,
          }))
        );
      }

      if (tData && Array.isArray(tData)) {
        setTasks(
          tData.map((t) => ({
            ...t,
            id: t.taskId,
            title: t.taskTitle,
            description: t.taskDescription,
          }))
        );
      }

      if (aData && Array.isArray(aData)) {
        setAllocations(aData);
      }
    } catch (err) {
      console.warn('Initial DataProvider sync from backend API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getNextId = (items) => Math.max(0, ...items.map((i) => i.id || 0)) + 1;

  const addUser = useCallback((user) => {
    const newUser = { ...user, id: getNextId(users) };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, [users]);

  const updateUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id || u.userId === id ? { ...u, ...updates } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id && u.userId !== id));
  }, []);

  const addRole = useCallback((role) => {
    const newRole = { ...role, id: getNextId(roles), userCount: 0, createdAt: new Date().toISOString().split('T')[0] };
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  }, [roles]);

  const updateRole = useCallback((id, updates) => {
    setRoles((prev) => prev.map((r) => (r.id === id || r.roleId === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteRole = useCallback((id) => {
    setRoles((prev) => prev.filter((r) => r.id !== id && r.roleId !== id));
  }, []);

  const assignRole = useCallback((assignment) => {
    const newAssignment = { ...assignment, id: getNextId(userRoles), assignedAt: new Date().toISOString().split('T')[0] };
    setUserRoles((prev) => [...prev, newAssignment]);
    return newAssignment;
  }, [userRoles]);

  const removeRoleAssignment = useCallback((id) => {
    setUserRoles((prev) => prev.filter((ur) => ur.id !== id && ur.rolePermissionId !== id));
  }, []);

  const addProject = useCallback((project) => {
    const newProject = { ...project, id: getNextId(projects) };
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, [projects]);

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) => prev.map((p) => (p.id === id || p.projectId === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id && p.projectId !== id));
  }, []);

  const addTask = useCallback((task) => {
    const newTask = { ...task, id: getNextId(tasks), createdAt: new Date().toISOString().split('T')[0] };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [tasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id || t.taskId === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id && t.taskId !== id));
  }, []);

  const getUserById = useCallback((id) => users.find((u) => u.id === id || u.userId === id), [users]);
  const getRoleById = useCallback((id) => roles.find((r) => r.id === id || r.roleId === id), [roles]);
  const getProjectById = useCallback((id) => projects.find((p) => p.id === id || p.projectId === id), [projects]);
  const getTaskById = useCallback((id) => tasks.find((t) => t.id === id || t.taskId === id), [tasks]);

  return (
    <DataContext.Provider
      value={{
        users,
        roles,
        userRoles,
        projects,
        tasks,
        allocations,
        loading,
        refreshData,
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
