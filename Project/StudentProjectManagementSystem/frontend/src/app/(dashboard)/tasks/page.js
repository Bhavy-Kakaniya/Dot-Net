'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
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
import { formatDate } from '@/utils/formatters';
import {
  projectTaskService,
  projectAllocationService,
  projectService,
  userService,
  statusService,
  priorityService,
} from '@/services/api';

export default function TasksPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [tasks, setTasks] = useState([]);
  const [allocationsMap, setAllocationsMap] = useState({});
  const [statusesMap, setStatusesMap] = useState({});
  const [prioritiesMap, setPrioritiesMap] = useState({});
  const [statusesList, setStatusesList] = useState([]);
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        tasksData,
        allocationsData,
        projectsData,
        usersData,
        statusesData,
        prioritiesData,
      ] = await Promise.all([
        projectTaskService.getAll(),
        projectAllocationService.getAll().catch(() => []),
        projectService.getAll().catch(() => []),
        userService.getAll().catch(() => []),
        statusService.getAll().catch(() => []),
        priorityService.getAll().catch(() => []),
      ]);

      const pMap = {};
      (projectsData || []).forEach((p) => {
        pMap[p.projectId] = p.projectTitle;
      });

      const uMap = {};
      (usersData || []).forEach((u) => {
        uMap[u.userId] = u.fullName || u.email;
      });

      const aMap = {};
      (allocationsData || []).forEach((a) => {
        const proj = pMap[a.projectId] || `Project #${a.projectId}`;
        const student = uMap[a.studentId] || `Student #${a.studentId}`;
        aMap[a.projectAllocationId] = `${proj} (${student})`;
      });
      setAllocationsMap(aMap);

      const sMap = {};
      const sList = [];
      (statusesData || []).forEach((s) => {
        const sName = s.statusName || s.taskStatusName;
        sMap[s.taskStatusId] = sName;
        if (sName && !sList.includes(sName)) sList.push(sName);
      });
      setStatusesMap(sMap);
      setStatusesList(sList);

      const prMap = {};
      const prList = [];
      (prioritiesData || []).forEach((p) => {
        const pName = p.taskPriorityName;
        prMap[p.taskPriorityId] = pName;
        if (pName && !prList.includes(pName)) prList.push(pName);
      });
      setPrioritiesMap(prMap);
      setPrioritiesList(prList);

      setTasks(tasksData || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
      showSnackbar(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enrich rows with resolved FK names
  const enrichedTasks = useMemo(() => {
    return tasks.map((t) => {
      const statusName = statusesMap[t.taskStatusId] || `Status #${t.taskStatusId}`;
      const priorityName = prioritiesMap[t.taskPriorityId] || `Priority #${t.taskPriorityId}`;
      const allocationName = allocationsMap[t.projectAllocationId] || `Allocation #${t.projectAllocationId}`;
      return {
        ...t,
        id: t.taskId,
        status: statusName,
        priority: priorityName,
        allocation: allocationName,
      };
    });
  }, [tasks, allocationsMap, statusesMap, prioritiesMap]);

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange, resetPage, paginate } = usePagination();
  const { search, setSearch, filters, handleFilterChange, resetFilters, filteredData } = useTableFilter(
    enrichedTasks,
    ['taskTitle', 'taskDescription', 'allocation'],
    { status: statusesList, priority: prioritiesList }
  );

  useEffect(() => {
    resetPage();
  }, [search, filters, resetPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectTaskService.delete(deleteTarget.taskId);
      showSnackbar('Task deleted successfully');
      setTasks((prev) => prev.filter((t) => t.taskId !== deleteTarget.taskId));
      setDeleteTarget(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete task', 'error');
    }
  };

  const columns = [
    { id: 'taskId', label: 'ID', minWidth: 60 },
    { id: 'taskTitle', label: 'Task Title', minWidth: 180 },
    { id: 'allocation', label: 'Project / Allocation', minWidth: 200 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      id: 'priority',
      label: 'Priority',
      minWidth: 100,
      render: (row) => <StatusChip status={row.priority} />,
    },
    {
      id: 'scores',
      label: 'Score (Earned/Assigned)',
      render: (row) => `${row.earnedScore !== null && row.earnedScore !== undefined ? row.earnedScore : '—'} / ${row.assignedScore}`,
    },
    {
      id: 'progressPercentage',
      label: 'Progress',
      minWidth: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      id: 'taskDueDate',
      label: 'Due Date',
      render: (row) => formatDate(row.taskDueDate),
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
                router.push(`/tasks/${row.taskId}`);
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
                router.push(`/tasks/${row.taskId}/edit`);
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
        title="Project Tasks"
        subtitle="Manage tasks, scores, priorities, and assignments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tasks', href: '/tasks' },
        ]}
        actionLabel="Add Task"
        actionHref="/tasks/add"
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
        placeholder="Search tasks, allocations, descriptions..."
        filters={[
          ...(statusesList.length > 0
            ? [{ key: 'status', label: 'Status', value: filters.status, onChange: (v) => handleFilterChange('status', v), options: statusesList }]
            : []),
          ...(prioritiesList.length > 0
            ? [{ key: 'priority', label: 'Priority', value: filters.priority, onChange: (v) => handleFilterChange('priority', v), options: prioritiesList }]
            : []),
        ]}
      />

      {loading ? (
        <Loader message="Loading project tasks..." />
      ) : (
        <DataTable
          columns={columns}
          rows={paginate(filteredData)}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={(row) => router.push(`/tasks/${row.taskId}`)}
          emptyTitle="No tasks found"
          emptyDescription="Create a task to assign work to a project allocation."
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message={`Delete task "${deleteTarget?.taskTitle}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
