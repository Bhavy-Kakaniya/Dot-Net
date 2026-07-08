'use client';

import { useState, useCallback } from 'react';
import { ROWS_PER_PAGE_OPTIONS } from '@/utils/constants';

export function usePagination(initialRowsPerPage = ROWS_PER_PAGE_OPTIONS[1]) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const resetPage = useCallback(() => setPage(0), []);

  const paginate = useCallback(
    (items) => {
      const start = page * rowsPerPage;
      return items.slice(start, start + rowsPerPage);
    },
    [page, rowsPerPage]
  );

  return {
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    resetPage,
    paginate,
  };
}
