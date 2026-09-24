export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(text, max = 50) {
  if (!text || text.length <= max) return text || '';
  return `${text.slice(0, max)}…`;
}

export function getProfileImageUrl(path) {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/avatars/') || path.startsWith('avatars/')) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5093';
  return encodeURI(`${baseUrl}/${cleanPath}`);
}
