'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import StatusChip from '@/components/StatusChip/StatusChip';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import Loader from '@/components/Loader/Loader';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { userService, userTypeService } from '@/services/api';

export default function UsersPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [userTypesMap, setUserTypesMap] = useState({});
  const [userTypesList, setUserTypesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, userTypesData] = await Promise.all([
        userService.getAll(),
        userTypeService.getAll().catch(() => []),
      ]);

      const utMap = {};
      const utList = [];
      (userTypesData || []).forEach((ut) => {
        utMap[ut.userTypeId] = ut.userTypeName;
        if (ut.userTypeName && !utList.includes(ut.userTypeName)) {
          utList.push(ut.userTypeName);
        }
      });
      setUserTypesMap(utMap);
      setUserTypesList(utList);

      setUsers(usersData || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to fetch users');
      showSnackbar(err.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrichedUsers = useMemo(() => {
    return users
      .filter((u) => !u.isDeleted)
      .map((u) => ({
        ...u,
        id: u.userId,
        name: u.fullName,
        type: userTypesMap[u.userTypeId] || `Type #${u.userTypeId}`,
        status: u.isActive ? 'Active' : 'Inactive',
      }));
  }, [users, userTypesMap]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, filters, handleFilterChange, resetFilters, filteredData } = useTableFilter(
    enrichedUsers,
    ['fullName', 'email', 'userCode', 'mobileNumber'],
    { type: userTypesList, status: ['Active', 'Inactive'] }
  );

  useEffect(() => {
    resetPage();
  }, [search, filters, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.delete(deleteTarget.userId);
      showSnackbar('User deleted successfully');
      setUsers((prev) => prev.filter((u) => u.userId !== deleteTarget.userId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete user', 'error');
    }
  };

  const columns = [
    { id: 'userId', label: 'ID', minWidth: 60 },
    { id: 'fullName', label: 'Full Name', minWidth: 160 },
    { id: 'userCode', label: 'User Code', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'type', label: 'User Type', minWidth: 120 },
    { id: 'mobileNumber', label: 'Mobile', minWidth: 130 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/users/${row.userId}`);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/users/${row.userId}/edit`);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
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
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage students, faculty, and system administrators"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Users', href: '/users' },
        ]}
        actionLabel="Add User"
        actionHref="/users/add"
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
        placeholder="Search users by name, email, code, mobile..."
        filters={[
          ...(userTypesList.length > 0
            ? [{ key: 'type', label: 'User Type', value: filters.type, onChange: (v) => handleFilterChange('type', v), options: userTypesList }]
            : []),
          { key: 'status', label: 'Status', value: filters.status, onChange: (v) => handleFilterChange('status', v), options: ['Active', 'Inactive'] },
        ]}
      />

      {loading ? (
        <Loader message="Loading users..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => router.push(`/users/${row.userId}`)}
          emptyTitle="No users found"
          emptyDescription="Create a user to get started."
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
