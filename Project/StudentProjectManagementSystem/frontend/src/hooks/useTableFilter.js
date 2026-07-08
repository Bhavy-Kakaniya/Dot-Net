'use client';

import { useState, useMemo, useCallback } from 'react';

export function useTableFilter(data, searchFields, filterConfig = {}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(
    Object.keys(filterConfig).reduce((acc, key) => ({ ...acc, [key]: 'all' }), {})
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return String(value ?? '').toLowerCase().includes(query);
        })
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter((item) => String(item[key]) === value);
      }
    });

    return result;
  }, [data, search, filters, searchFields]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters(Object.keys(filterConfig).reduce((acc, key) => ({ ...acc, [key]: 'all' }), {}));
  }, [filterConfig]);

  return {
    search,
    setSearch,
    filters,
    handleFilterChange,
    resetFilters,
    filteredData,
  };
}
