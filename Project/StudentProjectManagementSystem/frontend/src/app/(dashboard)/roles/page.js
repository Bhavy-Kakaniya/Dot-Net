'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useData } from '@/hooks/useData';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { formatDate } from '@/utils/formatters';

export default function RolesPage() {
  const router = useRouter();
  const { roles, deleteRole } = useData();
  const { showSnackbar } = useSnackbar();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, resetFilters, filteredData } = useTableFilter(roles, ['name', 'description'], {});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { resetPage(); }, [search, resetPage]);

  const columns = [
    { id: 'name', label: 'Role Name', minWidth: 160 },
    { id: 'description', label: 'Description', minWidth: 240 },
    {
      id: 'permissions',
      label: 'Permissions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.permissions.slice(0, 3).map((p) => (
            <Chip key={p} label={p} size="small" variant="outlined" />
          ))}
          {row.permissions.length > 3 && (
            <Chip label={`+${row.permissions.length - 3}`} size="small" />
          )}
        </Box>
      ),
    },
    { id: 'userCount', label: 'Users', align: 'center' },
    {
      id: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => router.push(`/roles/${row.id}/edit`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteTarget(row)}>
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
        subtitle="Manage user roles and permissions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Roles', href: '/roles' },
        ]}
        actionLabel="Add Role"
        actionHref="/roles/add"
      />

      <FiltersBar search={search} onSearchChange={setSearch} onReset={resetFilters} />

      <DataTable
        columns={columns}
        rows={paginate(filteredData)}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredData.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Role"
        message={`Delete role "${deleteTarget?.name}"?`}
        onConfirm={() => {
          deleteRole(deleteTarget.id);
          showSnackbar('Role deleted');
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
