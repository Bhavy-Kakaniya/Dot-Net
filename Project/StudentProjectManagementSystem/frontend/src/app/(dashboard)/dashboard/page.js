'use client';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, } from 'recharts';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader/PageHeader';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import DataTable from '@/components/DataTable/DataTable';
import StatusChip from '@/components/StatusChip/StatusChip';
import { useData } from '@/hooks/useData';
import { formatDate, formatDateTime } from '@/utils/formatters';
import activities from '@/data/activities';

const CHART_COLORS = ['#1565C0', '#42A5F5', '#90CAF9', '#BBDEFB', '#E3F2FD'];

export default function DashboardPage() {
	const router = useRouter();
	const { users, projects, tasks, getUserById } = useData();

	const totalUsers = users.length;
	const students = users.filter((u) => u.type === 'Student').length;
	const faculty = users.filter((u) => u.type === 'Faculty').length;

	const projectStatusData = [
		{ name: 'Planning', value: projects.filter((p) => p.status === 'Planning').length },
		{ name: 'In Progress', value: projects.filter((p) => p.status === 'In Progress').length },
		{ name: 'On Hold', value: projects.filter((p) => p.status === 'On Hold').length },
		{ name: 'Completed', value: projects.filter((p) => p.status === 'Completed').length },
	].filter((d) => d.value > 0);

	const taskStatusData = [
		{ name: 'To Do', count: tasks.filter((t) => t.status === 'To Do').length },
		{ name: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress').length },
		{ name: 'Review', count: tasks.filter((t) => t.status === 'Review').length },
		{ name: 'Done', count: tasks.filter((t) => t.status === 'Done').length },
		{ name: 'Blocked', count: tasks.filter((t) => t.status === 'Blocked').length },
	];

	const recentProjects = [...projects].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5);

	const upcomingTasks = [...tasks]
		.filter((t) => t.status !== 'Done').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);

	const projectColumns = [
		{ id: 'title', label: 'Project', minWidth: 200 },
		{
			id: 'status',
			label: 'Status',
			render: (row) => <StatusChip status={row.status} />,
		},
		{
			id: 'advisor',
			label: 'Advisor',
			render: (row) => getUserById(row.advisorId)?.name || '—',
		},
		{
			id: 'progress', label: 'Progress', render: (row) => (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
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
	];

	return (
		<Box>
			<PageHeader
				title="Dashboard"
				subtitle="Overview of your student project management system"
				breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}
			/>

			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
					<DashboardCard title="Total Users" value={totalUsers} icon={PeopleIcon} color="primary.main" trend={{ positive: true, value: '12% this month' }} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
					<DashboardCard title="Students" value={students} icon={SchoolIcon} color="#2E7D32" />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
					<DashboardCard title="Faculty" value={faculty} icon={PersonIcon} color="#7B1FA2" />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
					<DashboardCard title="Projects" value={projects.length} icon={FolderIcon} color="#E65100" />
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
					<DashboardCard title="Tasks" value={tasks.length} icon={TaskIcon} color="#C62828" />
				</Grid>
			</Grid>

			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Task Status Overview
						</Typography>
						<Box sx={{ height: 300, mt: 2 }}>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={taskStatusData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#E5E8EB" />
									<XAxis dataKey="name" tick={{ fontSize: 12 }} />
									<YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
									<Tooltip />
									<Bar dataKey="count" fill="#1565C0" radius={[6, 6, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</Box>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper sx={{ p: 3, height: '100%' }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>Project Status</Typography>
						<Box sx={{ height: 300, mt: 1 }}>
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
										{projectStatusData.map((_, index) => (<Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</Box>
					</Paper>
				</Grid>
			</Grid>

			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, lg: 7 }}>
					<Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Projects</Typography>
					<DataTable
						columns={projectColumns} rows={recentProjects} page={0}
						rowsPerPage={5} totalCount={recentProjects.length} onPageChange={() => { }}
						onRowsPerPageChange={() => { }} onRowClick={(row) => router.push(`/projects/${row.id}`)}
					/>
				</Grid>
				<Grid size={{ xs: 12, lg: 5 }}>
					<Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Upcoming Tasks</Typography>
					<Paper>
						<List disablePadding>
							{upcomingTasks.map((task, index) => (
								<ListItem
									key={task.id}
									divider={index < upcomingTasks.length - 1}
									sx={{ cursor: 'pointer' }}
									onClick={() => router.push(`/tasks/${task.id}`)}
								>
									<ListItemAvatar>
										<Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}><TaskIcon fontSize="small" /></Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={task.title}
										secondary={`Due: ${formatDate(task.dueDate)} • ${task.priority} priority`}
										primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
									/>
									<StatusChip status={task.status} />
								</ListItem>
							))}
						</List>
					</Paper>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Activities</Typography>
					<Paper sx={{ p: 2 }}>
						<List disablePadding>
							{activities.slice(0, 6).map((activity, index) => (
								<ListItem key={activity.id} divider={index < 5} sx={{ px: 1 }}>
									<ListItemAvatar>
										<Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'secondary.light' }}>{activity.user.charAt(0)}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Typography variant="body2">
												<strong>{activity.user}</strong> {activity.action}{' '}
												<strong>{activity.target}</strong>
											</Typography>
										}
										secondary={formatDateTime(activity.timestamp)}
									/>
								</ListItem>
							))}
						</List>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Project Progress</Typography>
					<Paper sx={{ p: 3 }}>
						{projects
							.filter((p) => p.status === 'In Progress')
							.slice(0, 5)
							.map((project) => (
								<Box key={project.id} sx={{ mb: 2.5 }}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
										<Typography variant="body2" fontWeight={500}>{project.title}</Typography>
										<Typography variant="caption" color="text.secondary">{project.progress}%</Typography>
									</Box>
									<LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
								</Box>
							))}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}