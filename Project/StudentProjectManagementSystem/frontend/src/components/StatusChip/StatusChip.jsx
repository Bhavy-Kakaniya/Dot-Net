import Chip from '@mui/material/Chip';
import { STATUS_COLORS } from '@/utils/constants';

export default function StatusChip({ status, size = 'small' }) {
  const color = STATUS_COLORS[status] || 'default';
  return <Chip label={status} color={color} size={size} variant="filled" />;
}
