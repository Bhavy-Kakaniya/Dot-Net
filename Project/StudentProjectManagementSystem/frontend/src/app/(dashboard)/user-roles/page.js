'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useData } from '@/hooks/useData';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';

export default function UserRolesPage() {
  const router = useRouter();
  const { userRoles, users, roles, getUserById, getRoleById, removeRoleAssignment } = useData();
  const { showSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();

  const enrichedData = userRoles.map((ur) => ({
    ...ur,
    userName: getUserById(ur.userId)?.name || 'Unknown',
    roleName: getRoleById(ur.roleId)?.name || 'Unknown',
    userEmail: getUserById(ur.userId)?.email || '',
  }));

  const { search, setSearch, resetFilters, filteredData } = useTableFilter(
    enrichedData,
    ['userName', 'roleName', 'userEmail'],
    {}
  );

  useEffect(() => { resetPage(); }, [search, resetPage]);

  const columns = [
    { id: 'userName', label: 'User', minWidth: 160 },
    { id: 'userEmail', label: 'Email', minWidth: 200 },
    { id: 'roleName', label: 'Role', minWidth: 140 },
    { id: 'assignedBy', label: 'Assigned By' },
    {
      id: 'assignedAt',
      label: 'Assigned Date',
      render: (row) => formatDate(row.assignedAt),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Tooltip title="Remove Assignment">
          <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
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

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="View Assignments" onClick={() => router.push('/user-roles')} />
        <Tab label="Assign Role" onClick={() => router.push('/user-roles/assign')} />
      </Tabs>

      <FiltersBar search={search} onSearchChange={setSearch} onReset={resetFilters} />

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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Assignment"
        message={`Remove "${deleteTarget?.roleName}" role from ${deleteTarget?.userName}?`}
        onConfirm={() => {
          removeRoleAssignment(deleteTarget.id);
          showSnackbar('Role assignment removed');
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
