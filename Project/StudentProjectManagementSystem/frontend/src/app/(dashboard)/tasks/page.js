'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import FiltersBar from '@/components/FiltersBar/FiltersBar';
import DataTable from '@/components/DataTable/DataTable';
import StatusChip from '@/components/StatusChip/StatusChip';
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog';
import { useData } from '@/hooks/useData';
import { usePagination } from '@/hooks/usePagination';
import { useTableFilter } from '@/hooks/useTableFilter';
import { useSnackbar } from '@/hooks/useSnackbar';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

export default function TasksPage() {
  const router = useRouter();
  const { tasks, deleteTask, getProjectById, getUserById } = useData();
  const { showSnackbar } = useSnackbar();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, filters, handleFilterChange, resetFilters, filteredData } = useTableFilter(
    tasks,
    ['title', 'description'],
    { status: TASK_STATUSES, priority: TASK_PRIORITIES }
  );
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { resetPage(); }, [search, filters, resetPage]);

  const columns = [
    { id: 'title', label: 'Task', minWidth: 180 },
    {
      id: 'project',
      label: 'Project',
      render: (row) => getProjectById(row.projectId)?.title || '—',
    },
    {
      id: 'assignee',
      label: 'Assignee',
      render: (row) => getUserById(row.assigneeId)?.name || '—',
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: 'priority',
      label: 'Priority',
      render: (row) => <StatusChip status={row.priority} />,
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      render: (row) => formatDate(row.dueDate),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${row.id}`); }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/tasks/${row.id}/edit`); }}>
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
        title="Tasks"
        subtitle="Manage project tasks and assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
        ]}
        actionLabel="Add Task"
        actionHref="/tasks/add"
      />

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        filters={[
          { key: 'status', label: 'Status', value: filters.status, onChange: (v) => handleFilterChange('status', v), options: TASK_STATUSES },
          { key: 'priority', label: 'Priority', value: filters.priority, onChange: (v) => handleFilterChange('priority', v), options: TASK_PRIORITIES },
        ]}
      />

      <DataTable
        columns={columns}
        rows={paginate(filteredData)}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredData.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={(row) => router.push(`/tasks/${row.id}`)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message={`Delete task "${deleteTarget?.title}"?`}
        onConfirm={() => {
          deleteTask(deleteTarget.id);
          showSnackbar('Task deleted');
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
