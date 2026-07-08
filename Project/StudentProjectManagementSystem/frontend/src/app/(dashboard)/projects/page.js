'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
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
import { PROJECT_STATUSES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, deleteProject, getUserById } = useData();
  const { showSnackbar } = useSnackbar();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, filters, handleFilterChange, resetFilters, filteredData } = useTableFilter(
    projects,
    ['title', 'description', 'department'],
    { status: PROJECT_STATUSES }
  );
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { resetPage(); }, [search, filters, resetPage]);

  const columns = [
    { id: 'title', label: 'Project', minWidth: 200 },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    { id: 'department', label: 'Department' },
    {
      id: 'advisor',
      label: 'Advisor',
      render: (row) => getUserById(row.advisorId)?.name || '—',
    },
    {
      id: 'progress',
      label: 'Progress',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
          <LinearProgress variant="determinate" value={row.progress} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
          <Typography variant="caption">{row.progress}%</Typography>
        </Box>
      ),
    },
    {
      id: 'endDate',
      label: 'Due Date',
      render: (row) => formatDate(row.endDate),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="View">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/projects/${row.id}`); }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/projects/${row.id}/edit`); }}>
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
        title="Projects"
        subtitle="Manage student projects"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
        ]}
        actionLabel="Add Project"
        actionHref="/projects/add"
      />

      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
        filters={[
          { key: 'status', label: 'Status', value: filters.status, onChange: (v) => handleFilterChange('status', v), options: PROJECT_STATUSES },
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
        onRowClick={(row) => router.push(`/projects/${row.id}`)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Delete project "${deleteTarget?.title}"?`}
        onConfirm={() => {
          deleteProject(deleteTarget.id);
          showSnackbar('Project deleted');
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
