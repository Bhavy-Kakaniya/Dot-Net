'use client';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchBar from '@/components/SearchBar/SearchBar';

export default function FiltersBar({ search, onSearchChange, filters = [], onReset }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
        alignItems: 'center',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search..." fullWidth />
      </Box>
      {filters.map((filter) => (
        <FormControl key={filter.key} size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{filter.label}</InputLabel>
          <Select
            value={filter.value}
            label={filter.label}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {filter.options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      {onReset && (
        <Button startIcon={<FilterListIcon />} onClick={onReset} size="small">
          Reset
        </Button>
      )}
    </Box>
  );
}
