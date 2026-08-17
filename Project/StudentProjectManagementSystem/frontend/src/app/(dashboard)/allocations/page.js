'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
import { formatDate } from '@/utils/formatters';
import { projectAllocationService, projectService, userService } from '@/services/api';

export default function AllocationsPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [allocations, setAllocations] = useState([]);
  const [projectsMap, setProjectsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allocationsData, projectsData, usersData] = await Promise.all([
        projectAllocationService.getAll(),
        projectService.getAll().catch(() => []),
        userService.getAll().catch(() => []),
      ]);

      const pMap = {};
      (projectsData || []).forEach((p) => {
        pMap[p.projectId] = p.projectTitle;
      });
      setProjectsMap(pMap);

      const uMap = {};
      (usersData || []).forEach((u) => {
        uMap[u.userId] = u.fullName || u.email;
      });
      setUsersMap(uMap);

      setAllocations(allocationsData || []);
    } catch (err) {
      console.error('Failed to load allocations:', err);
      setError(err.message || 'Failed to fetch allocations');
      showSnackbar(err.message || 'Failed to fetch allocations', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enrich rows with resolved FK names for table display & filtering
  const enrichedAllocations = useMemo(() => {
    return allocations.map((item) => ({
      ...item,
      id: item.projectAllocationId,
      projectTitle: projectsMap[item.projectId] || `Project #${item.projectId}`,
      studentName: usersMap[item.studentId] || `Student #${item.studentId}`,
      facultyName: usersMap[item.facultyId] || `Faculty #${item.facultyId}`,
    }));
  }, [allocations, projectsMap, usersMap]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, resetFilters, filteredData } = useTableFilter(
    enrichedAllocations,
    ['projectTitle', 'studentName', 'facultyName', 'overallGrade'],
    {}
  );

  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectAllocationService.delete(deleteTarget.projectAllocationId);
      showSnackbar('Project allocation deleted successfully');
      setAllocations((prev) => prev.filter((a) => a.projectAllocationId !== deleteTarget.projectAllocationId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete allocation', 'error');
    }
  };

  const columns = [
    { id: 'projectAllocationId', label: 'ID', minWidth: 60 },
    { id: 'projectTitle', label: 'Project', minWidth: 180 },
    { id: 'studentName', label: 'Student', minWidth: 150 },
    { id: 'facultyName', label: 'Faculty / Advisor', minWidth: 150 },
    {
      id: 'progressPercentage',
      label: 'Progress',
      minWidth: 130,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <LinearProgress
            variant="determinate"
            value={Number(row.progressPercentage) || 0}
            sx={{ flex: 1, height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{Number(row.progressPercentage || 0).toFixed(0)}%</Typography>
        </Box>
      ),
    },
    {
      id: 'tasks',
      label: 'Tasks (Done/Total)',
      render: (row) => `${row.totalCompletedTasks || 0} / ${row.totalTasksGiven || 0}`,
    },
    {
      id: 'projectStartDate',
      label: 'Start Date',
      render: (row) => formatDate(row.projectStartDate),
    },
    {
      id: 'projectEndDate',
      label: 'End Date',
      render: (row) => formatDate(row.projectEndDate),
    },
    {
      id: 'overallGrade',
      label: 'Grade',
      align: 'center',
      render: (row) =>
        row.overallGrade ? (
          <Chip label={row.overallGrade} size="small" color="primary" variant="outlined" />
        ) : (
          <Typography variant="caption" color="text.secondary">—</Typography>
        ),
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
                router.push(`/allocations/${row.projectAllocationId}`);
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
                router.push(`/allocations/${row.projectAllocationId}/edit`);
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
        title="Project Allocations"
        subtitle="Manage student project allocations and faculty advisors"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Allocations', href: '/allocations' },
        ]}
        actionLabel="Add Allocation"
        actionHref="/allocations/add"
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
        placeholder="Search by project, student, faculty, grade..."
      />

      {loading ? (
        <Loader message="Loading project allocations..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => router.push(`/allocations/${row.projectAllocationId}`)}
          emptyTitle="No project allocations found"
          emptyDescription="Create an allocation to assign students and faculty to projects."
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project Allocation"
        message={`Are you sure you want to delete allocation #${deleteTarget?.projectAllocationId} (${deleteTarget?.projectTitle} - ${deleteTarget?.studentName})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
