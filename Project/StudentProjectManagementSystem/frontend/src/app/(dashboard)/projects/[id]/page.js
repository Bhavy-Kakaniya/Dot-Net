'use client';

import { useRouter, useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/PageHeader/PageHeader';
import StatusChip from '@/components/StatusChip/StatusChip';
import DataTable from '@/components/DataTable/DataTable';
import EmptyState from '@/components/EmptyState/EmptyState';
import { useData } from '@/hooks/useData';
import { formatDate } from '@/utils/formatters';

export default function ProjectDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const { getProjectById, getUserById, tasks } = useData();
	const projectId = parseInt(params.id, 10);
	const project = getProjectById(projectId);

	if (!project) {
		return (
			<EmptyState
				title="Project not found" description="The project you are looking for does not exist." actionLabel="Back to Projects"
				onAction={() => router.push('/projects')}
			/>
		);
	}

	const advisor = getUserById(project.advisorId);
	const projectStudents = project.studentIds.map((id) => getUserById(id)).filter(Boolean);
	const projectTasks = tasks.filter((t) => t.projectId === projectId);

	const taskColumns = [
		{ id: 'title', label: 'Task' },
		{ id: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
		{ id: 'priority', label: 'Priority', render: (row) => <StatusChip status={row.priority} /> },
		{ id: 'dueDate', label: 'Due Date', render: (row) => formatDate(row.dueDate) },
	];

	return (
		<Box>
			<PageHeader
				title={project.title}
				subtitle={project.description}
				breadcrumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Projects', href: '/projects' },
					{ label: project.title, href: `/projects/${projectId}` },
				]}
				actionLabel="Edit Project"
				actionHref={`/projects/${projectId}/edit`}
				actionIcon={EditIcon}
			/>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={{ p: 3, mb: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="h6" fontWeight={600}>Project Overview</Typography>
							<StatusChip status={project.status} />
						</Box>
						<Box sx={{ mb: 3 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant="body2">Progress</Typography>
								<Typography variant="body2" fontWeight={600}>{project.progress}%</Typography>
							</Box>
							<LinearProgress variant="determinate" value={project.progress} sx={{ height: 10, borderRadius: 5 }} />
						</Box>
						<Grid container spacing={2}>
							<Grid size={{ xs: 6, sm: 4 }}>
								<Typography variant="caption" color="text.secondary">Department</Typography>
								<Typography variant="body1">{project.department}</Typography>
							</Grid>
							<Grid size={{ xs: 6, sm: 4 }}>
								<Typography variant="caption" color="text.secondary">Start Date</Typography>
								<Typography variant="body1">{formatDate(project.startDate)}</Typography>
							</Grid>
							<Grid size={{ xs: 6, sm: 4 }}>
								<Typography variant="caption" color="text.secondary">End Date</Typography>
								<Typography variant="body1">{formatDate(project.endDate)}</Typography>
							</Grid>
							<Grid size={{ xs: 6, sm: 4 }}>
								<Typography variant="caption" color="text.secondary">Budget</Typography>
								<Typography variant="body1">${project.budget.toLocaleString()}</Typography>
							</Grid>
							<Grid size={{ xs: 6, sm: 4 }}>
								<Typography variant="caption" color="text.secondary">Advisor</Typography>
								<Typography variant="body1">{advisor?.name || '—'}</Typography>
							</Grid>
						</Grid>
					</Paper>

					<Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Project Tasks</Typography>
					<DataTable
						columns={taskColumns} rows={projectTasks} page={0} rowsPerPage={10} totalCount={projectTasks.length}
						onPageChange={() => { }} onRowsPerPageChange={() => { }} 
						onRowClick={(row) => router.push(`/tasks/${row.id}`)}
						emptyTitle="No tasks" emptyDescription="No tasks assigned to this project yet."
					/>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>Team Members</Typography>
						<Divider sx={{ mb: 2 }} />
						<Typography variant="subtitle2" color="text.secondary" gutterBottom>Advisor</Typography>
						<Typography variant="body1" sx={{ mb: 2 }}>{advisor?.name || '—'}</Typography>
						<Typography variant="subtitle2" color="text.secondary" gutterBottom>Students</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
							{projectStudents.map((s) => (
								<Chip key={s.id} label={s.name} variant="outlined" size="small" />
							))}
						</Box>
						<Button variant="outlined" fullWidth onClick={() => router.push('/projects')}>
							Back to Projects
						</Button>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}