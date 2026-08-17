'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import Loader from '@/components/Loader/Loader';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { roleService, userRoleService } from '@/services/api';

export default function RolesPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, userRolesData] = await Promise.all([
        roleService.getAll(),
        userRoleService.getAll().catch(() => []),
      ]);

      setRoles(rolesData || []);
      setUserRoles(userRolesData || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
      setError(err.message || 'Failed to fetch roles');
      showSnackbar(err.message || 'Failed to fetch roles', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrichedRoles = useMemo(() => {
    return roles.map((r) => {
      const assignedCount = userRoles.filter((ur) => Number(ur.roleId) === Number(r.roleId)).length;
      return {
        ...r,
        id: r.roleId,
        userCount: assignedCount,
      };
    });
  }, [roles, userRoles]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, resetFilters, filteredData } = useTableFilter(
    enrichedRoles,
    ['roleName', 'description'],
    {}
  );

  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await roleService.delete(deleteTarget.roleId);
      showSnackbar('Role deleted successfully');
      setRoles((prev) => prev.filter((r) => r.roleId !== deleteTarget.roleId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete role', 'error');
    }
  };

  const columns = [
    { id: 'roleId', label: 'ID', minWidth: 60 },
    { id: 'roleName', label: 'Role Name', minWidth: 180 },
    { id: 'description', label: 'Description', minWidth: 240 },
    {
      id: 'userCount',
      label: 'Assigned Users',
      align: 'center',
      render: (row) => `${row.userCount} user(s)`,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => router.push(`/roles/${row.roleId}/edit`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteTarget(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Roles"
        subtitle="Manage system roles and descriptions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Roles', href: '/roles' },
        ]}
        actionLabel="Add Role"
        actionHref="/roles/add"
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        placeholder="Search roles by name, description..."
      />

      {loading ? (
        <Loader message="Loading roles..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          emptyTitle="No roles found"
          emptyDescription="Create a role to get started."
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Role"
        message={`Delete role "${deleteTarget?.roleName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
