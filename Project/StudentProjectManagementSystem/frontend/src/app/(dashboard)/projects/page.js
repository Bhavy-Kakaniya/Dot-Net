'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
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
import { useAuth } from '@/hooks/useAuth';
import { projectService, projectAllocationService } from '@/services/api';

export default function ProjectsPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { user, isAdmin, isFaculty, isStudent } = useAuth();

  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, allocationsData] = await Promise.all([
        projectService.getAll(),
        projectAllocationService.getAll().catch(() => []),
      ]);

      setProjects(projectsData || []);
      setAllocations(allocationsData || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Failed to fetch projects');
      showSnackbar(err.message || 'Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enrich & filter project rows based on role
  const enrichedProjects = useMemo(() => {
    let filteredProjects = projects;

    if (isStudent && user) {
      // Students only see projects allocated to them
      const studentAllocatedProjectIds = allocations
        .filter((a) => Number(a.studentId) === Number(user.id) || a.student?.email === user.email)
        .map((a) => Number(a.projectId));
      filteredProjects = projects.filter((p) => studentAllocatedProjectIds.includes(Number(p.projectId)));
    } else if (isFaculty && user) {
      const facultyProjectIds = allocations
        .filter((a) => Number(a.facultyId) === Number(user.id) || a.faculty?.email === user.email)
        .map((a) => Number(a.projectId));
      filteredProjects = projects.filter((p) => facultyProjectIds.includes(Number(p.projectId)));
    }

    return filteredProjects.map((p) => {
      const pAllocations = allocations.filter((a) => Number(a.projectId) === Number(p.projectId));
      const totalAllocations = pAllocations.length;
      const avgProgress =
        totalAllocations > 0
          ? pAllocations.reduce((sum, a) => sum + (Number(a.progressPercentage) || 0), 0) / totalAllocations
          : 0;

      return {
        ...p,
        id: p.projectId,
        title: p.projectTitle,
        allocationsCount: totalAllocations,
        progress: avgProgress,
      };
    });
  }, [projects, allocations, isStudent, isFaculty, user]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, resetFilters, filteredData } = useTableFilter(
    enrichedProjects,
    ['projectTitle'],
    {}
  );

  useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectService.delete(deleteTarget.projectId);
      showSnackbar('Project deleted successfully');
      setProjects((prev) => prev.filter((p) => p.projectId !== deleteTarget.projectId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete project', 'error');
    }
  };

  const columns = [
    { id: 'projectTitle', label: 'Project Title', minWidth: 240 },
    {
      id: 'allocationsCount',
      label: 'Allocated Students',
      align: 'center',
      render: (row) => `${row.allocationsCount} student(s)`,
    },
    {
      id: 'progress',
      label: 'Avg Progress',
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
          <LinearProgress
            variant="determinate"
            value={row.progress || 0}
            sx={{ flex: 1, height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption">{Number(row.progress || 0).toFixed(0)}%</Typography>
        </Box>
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
                router.push(`/projects/${row.projectId}`);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Edit & Delete reserved for Admin / Faculty */}
          {!isStudent && (
            <>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${row.projectId}/edit`);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isAdmin && (
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
              )}
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={isStudent ? 'My Assigned Projects' : 'Projects'}
        subtitle={isStudent ? 'View your allocated capstone project details' : 'Manage academic and student projects'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
        ]}
        actionLabel={isAdmin ? 'Add Project' : null}
        actionHref={isAdmin ? '/projects/add' : null}
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
        placeholder="Search projects by title..."
      />

      {loading ? (
        <Loader message="Loading projects..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => router.push(`/projects/${row.projectId}`)}
          emptyTitle={isStudent ? 'No assigned project found' : 'No projects found'}
          emptyDescription={isStudent ? 'You currently do not have an active project allocation.' : 'Create a project to get started.'}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.projectTitle}"? This will delete associated allocations and tasks.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
