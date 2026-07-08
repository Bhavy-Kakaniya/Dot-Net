'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import StatusChip from '@/components/StatusChip/StatusChip';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useData } from '@/hooks/useData';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { USER_TYPES, USER_STATUSES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

export default function UsersPage() {
  const router = useRouter();
  const { users, deleteUser } = useData();
  const { showSnackbar } = useSnackbar();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, filters, handleFilterChange, resetFilters, filteredData } = useTableFilter(
    users,
    ['name', 'email', 'department'],
    { type: USER_TYPES, status: USER_STATUSES }
  );
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    resetPage();
  }, [search, filters, resetPage]);

  const paginatedRows = paginate(filteredData);

  const handleDelete = () => {
    deleteUser(deleteTarget.id);
    showSnackbar('User deleted successfully');
    setDeleteTarget(null);
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 160 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'type', label: 'Type' },
    { id: 'department', label: 'Department', minWidth: 160 },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: 'enrolledDate',
      label: 'Enrolled',
      render: (row) => formatDate(row.enrolledDate),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/users/${row.id}`); }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/users/${row.id}/edit`); }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}>
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
        title="Users"
        subtitle="Manage all system users"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
        ]}
        actionLabel="Add User"
        actionHref="/users/add"
      />

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        filters={[
          { key: 'type', label: 'Type', value: filters.type, onChange: (v) => handleFilterChange('type', v), options: USER_TYPES },
          { key: 'status', label: 'Status', value: filters.status, onChange: (v) => handleFilterChange('status', v), options: USER_STATUSES },
        ]}
      />

      <DataTable
        columns={columns}
        rows={paginatedRows}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredData.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={(row) => router.push(`/users/${row.id}`)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
