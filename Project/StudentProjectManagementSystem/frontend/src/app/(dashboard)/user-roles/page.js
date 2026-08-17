'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import Loader from '@/components/Loader/Loader';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { userRoleService, userService, roleService } from '@/services/api';

export default function UserRolesPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [userRoles, setUserRoles] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [rolesMap, setRolesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRolesData, usersData, rolesData] = await Promise.all([
        userRoleService.getAll(),
        userService.getAll().catch(() => []),
        roleService.getAll().catch(() => []),
      ]);

      const uMap = {};
      (usersData || []).forEach((u) => {
        uMap[u.userId] = { name: u.fullName, email: u.email, code: u.userCode };
      });
      setUsersMap(uMap);

      const rMap = {};
      (rolesData || []).forEach((r) => {
        rMap[r.roleId] = r.roleName;
      });
      setRolesMap(rMap);

      setUserRoles(userRolesData || []);
    } catch (err) {
      console.error('Failed to load user roles:', err);
      setError(err.message || 'Failed to fetch user roles');
      showSnackbar(err.message || 'Failed to fetch user roles', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrichedData = useMemo(() => {
    return userRoles.map((ur) => {
      const user = usersMap[ur.userId];
      const roleName = rolesMap[ur.roleId] || `Role #${ur.roleId}`;
      return {
        ...ur,
        id: ur.rolePermissionId,
        userName: user?.name || `User #${ur.userId}`,
        userEmail: user?.email || '',
        userCode: user?.code || '',
        roleName,
      };
    });
  }, [userRoles, usersMap, rolesMap]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, resetFilters, filteredData } = useTableFilter(
    enrichedData,
    ['userName', 'roleName', 'userEmail', 'userCode'],
    {}
  );

  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userRoleService.delete(deleteTarget.rolePermissionId);
      showSnackbar('Role assignment removed successfully');
      setUserRoles((prev) => prev.filter((ur) => ur.rolePermissionId !== deleteTarget.rolePermissionId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to remove role assignment', 'error');
    }
  };

  const columns = [
    { id: 'rolePermissionId', label: 'ID', minWidth: 60 },
    { id: 'userName', label: 'User Name', minWidth: 160 },
    { id: 'userEmail', label: 'Email', minWidth: 200 },
    { id: 'userCode', label: 'User Code', minWidth: 120 },
    {
      id: 'roleName',
      label: 'Assigned Role',
      minWidth: 150,
      render: (row) => <Chip label={row.roleName} color="primary" variant="outlined" size="small" />,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Tooltip title="Remove Assignment">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="User Roles"
        subtitle="Manage role assignments for users"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'User Roles', href: '/user-roles' },
        ]}
        actionLabel="Assign Role"
        actionHref="/user-roles/assign"
      />

      <Tabs value={0} sx={{ mb: 3 }}>
        <Tab label="View Assignments" onClick={() => router.push('/user-roles')} />
        <Tab label="Assign Role" onClick={() => router.push('/user-roles/assign')} />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        placeholder="Search assignments by user, role, email..."
      />

      {loading ? (
        <Loader message="Loading user role assignments..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          emptyTitle="No role assignments"
          emptyDescription="Assign roles to users to get started."
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Assignment"
        message={`Remove "${deleteTarget?.roleName}" role from ${deleteTarget?.userName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
