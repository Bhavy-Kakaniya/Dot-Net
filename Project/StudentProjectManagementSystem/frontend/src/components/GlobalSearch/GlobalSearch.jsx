'use client';

import { useState, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useData } from '@/hooks/useData';

const MAX_RESULTS = 4;

export default function GlobalSearch() {
  const router = useRouter();
  const { users, projects, tasks } = useData();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { users: [], projects: [], tasks: [] };

    const match = (text) => String(text ?? '').toLowerCase().includes(q);

    return {
      users: users
        .filter((u) => match(u.name) || match(u.email) || match(u.department))
        .slice(0, MAX_RESULTS),
      projects: projects
        .filter((p) => match(p.title) || match(p.description) || match(p.department))
        .slice(0, MAX_RESULTS),
      tasks: tasks
        .filter((t) => match(t.title) || match(t.description))
        .slice(0, MAX_RESULTS),
    };
  }, [query, users, projects, tasks]);

  const hasResults =
    results.users.length > 0 || results.projects.length > 0 || results.tasks.length > 0;

  const handleNavigate = (path) => {
    setQuery('');
    setOpen(false);
    router.push(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <SearchBar
          placeholder="Search anything..."
          fullWidth
          value={query}
          onChange={(value) => {
            setQuery(value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />

        {open && query.trim() && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 360,
              overflow: 'auto',
            }}
          >
            {!hasResults ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No results found for &quot;{query.trim()}&quot;
              </Typography>
            ) : (
              <List dense disablePadding>
                {results.users.length > 0 && (
                  <>
                    <ListSubheader sx={{ lineHeight: 2.5 }}>Users</ListSubheader>
                    {results.users.map((user) => (
                      <ListItemButton key={`user-${user.id}`} onClick={() => handleNavigate(`/users/${user.id}`)}>
                        <PeopleIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                        <ListItemText primary={user.name} secondary={user.email} />
                      </ListItemButton>
                    ))}
                  </>
                )}
                {results.projects.length > 0 && (
                  <>
                    <ListSubheader sx={{ lineHeight: 2.5 }}>Projects</ListSubheader>
                    {results.projects.map((project) => (
                      <ListItemButton key={`project-${project.id}`} onClick={() => handleNavigate(`/projects/${project.id}`)}>
                        <FolderIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                        <ListItemText primary={project.title} secondary={project.department} />
                      </ListItemButton>
                    ))}
                  </>
                )}
                {results.tasks.length > 0 && (
                  <>
                    <ListSubheader sx={{ lineHeight: 2.5 }}>Tasks</ListSubheader>
                    {results.tasks.map((task) => (
                      <ListItemButton key={`task-${task.id}`} onClick={() => handleNavigate(`/tasks/${task.id}`)}>
                        <TaskIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                        <ListItemText primary={task.title} secondary={task.status} />
                      </ListItemButton>
                    ))}
                  </>
                )}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
