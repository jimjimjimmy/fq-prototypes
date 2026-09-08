import { useState } from 'react';

export function usePagination(initialRowsPerPage = 15) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const resetPage = () => setCurrentPage(1);

  const paginate = <T,>(items: T[]): { paginatedItems: T[]; totalPages: number } => {
    const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    return {
      paginatedItems: items.slice(startIndex, startIndex + rowsPerPage),
      totalPages,
    };
  };

  return { currentPage, setCurrentPage, rowsPerPage, setRowsPerPage, resetPage, paginate };
}
