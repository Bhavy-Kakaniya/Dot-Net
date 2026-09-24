'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PageHeader from '@/components/PageHeader/PageHeader';
import FormContainer from '@/components/FormContainer/FormContainer';
import StatusChip from '@/components/StatusChip/StatusChip';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from '@/hooks/useSnackbar';
import { userService } from '@/services/api';
import { getInitials, getProfileImageUrl } from '@/utils/formatters';

export default function ProfilePage() {
	const { user, updateUser } = useAuth();
	const { showSnackbar } = useSnackbar();
	const [uploading, setUploading] = useState(false);
	const [userData, setUserData] = useState(null);

	const [form, setForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: user?.mobileNumber || '',
		department: 'Computer Science',
		bio: 'Student Project Management System user account profile.',
		notifications: 'all',
	});

	useEffect(() => {
		if (user?.id) {
			userService.getById(user.id)
				.then((data) => {
					if (data) {
						setUserData(data);
						setForm((prev) => ({
							...prev,
							name: data.fullName || prev.name,
							email: data.email || prev.email,
							phone: data.mobileNumber || prev.phone,
						}));
						if (data.profilePicturePath && data.profilePicturePath !== user.profilePicturePath) {
							updateUser({ profilePicturePath: data.profilePicturePath });
						}
					}
				})
				.catch((err) => {
					console.error('Failed to fetch profile details:', err);
				});
		}
	}, [user?.id, user?.profilePicturePath, updateUser]);

	const handleChange = (field) => (e) => {
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
	};

	const handleFileChange = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!user?.id) {
			showSnackbar('User session ID not found', 'error');
			return;
		}

		const formData = new FormData();
		formData.append('File', file);

		setUploading(true);
		try {
			const updatedUser = await userService.uploadProfilePicture(user.id, formData);
			showSnackbar('Profile picture uploaded successfully!');
			setUserData(updatedUser);
			if (updatedUser?.profilePicturePath) {
				updateUser({ profilePicturePath: updatedUser.profilePicturePath });
			}
		} catch (err) {
			console.error('Profile picture upload failed:', err);
			showSnackbar(err.message || 'Failed to upload profile picture', 'error');
		} finally {
			setUploading(false);
		}
	};

	const avatarSrc = getProfileImageUrl(userData?.profilePicturePath || user?.profilePicturePath);

	return (
		<Box>
			<PageHeader
				title="Profile"
				subtitle="Manage your account settings and preferences"
				breadcrumbs={[
					{ label: 'Dashboard', href: '/dashboard' },
					{ label: 'Profile', href: '/profile' },
				]}
			/>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 4 }}>
					<FormContainer maxWidth="100%">
						<Box sx={{ textAlign: 'center' }}>
							<Avatar
								src={avatarSrc}
								sx={{ width: 110, height: 110, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 36 }}
							>
								{getInitials(form.name)}
							</Avatar>

							<Box sx={{ mb: 2 }}>
								<input
									accept="image/*"
									style={{ display: 'none' }}
									id="profile-picture-upload"
									type="file"
									onChange={handleFileChange}
									disabled={uploading}
								/>
								<label htmlFor="profile-picture-upload">
									<Button
										variant="outlined"
										size="small"
										component="span"
										startIcon={uploading ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
										disabled={uploading}
									>
										{uploading ? 'Uploading...' : 'Upload Picture'}
									</Button>
								</label>
							</Box>

							<Typography variant="h6" fontWeight={600}>{form.name}</Typography>
							<Typography variant="body2" color="text.secondary" gutterBottom>{form.email}</Typography>
							<StatusChip status="Active" />
							<Divider sx={{ my: 3 }} />
							<Box sx={{ textAlign: 'left' }}>
								<Typography variant="body2" color="text.secondary">Department</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>{form.department}</Typography>
								<Typography variant="body2" color="text.secondary">Role</Typography>
								<Typography variant="body1" sx={{ mb: 2 }}>{user?.type || 'User'}</Typography>
							</Box>
						</Box>
					</FormContainer>
				</Grid>

				<Grid size={{ xs: 12, md: 8 }}>
					<FormContainer maxWidth="100%">
						<Typography variant="h6" fontWeight={600} gutterBottom>Edit Profile</Typography>
						<Grid container spacing={2.5}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Full Name" value={form.name} onChange={handleChange('name')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Email" value={form.email} onChange={handleChange('email')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField fullWidth label="Department" value={form.department} onChange={handleChange('department')} />
							</Grid>
							<Grid size={12}>
								<TextField fullWidth label="Bio" multiline rows={3} value={form.bio} onChange={handleChange('bio')} />
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>Notification Preference</InputLabel>
									<Select value={form.notifications} label="Notification Preference" onChange={handleChange('notifications')}>
										<MenuItem value="all">All Notifications</MenuItem>
										<MenuItem value="important">Important Only</MenuItem>
										<MenuItem value="none">None</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={12}>
								<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
									<Button variant="outlined">Cancel</Button>
									<Button variant="contained" onClick={() => showSnackbar('Profile updated successfully')}>Save Changes</Button>
								</Box>
							</Grid>
						</Grid>
					</FormContainer>
				</Grid>
			</Grid>
		</Box>
	);
}
