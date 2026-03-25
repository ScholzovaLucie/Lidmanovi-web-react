import { useState, useMemo } from 'react';

/**
 * Custom hook pro správu stránkování
 * @param {Object} options - Konfigurace stránkování
 * @param {number} options.initialPage - Počáteční stránka (1-based)
 * @param {number} options.initialPageSize - Počáteční velikost stránky
 * @param {Array} options.rowsPerPageOptions - Možnosti velikosti stránky
 * @returns {Object} Objekt s hodnotami a funkcemi pro stránkování
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  rowsPerPageOptions = [5, 10, 25, 50]
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const pagination = useMemo(() => ({
    // Hodnoty
    page,
    pageSize,
    pageIndex: page - 1, // 0-based pro MUI
    rowsPerPageOptions,
    
    // Funkce
    nextPage: () => setPage(prev => prev + 1),
    previousPage: () => setPage(prev => Math.max(prev - 1, 1)),
    goToPage: (newPage) => setPage(newPage),
    changePageSize: (newPageSize) => {
      setPageSize(newPageSize);
      setPage(1); // Reset na první stránku
    },
    reset: () => {
      setPage(initialPage);
      setPageSize(initialPageSize);
    }
  }), [page, pageSize, rowsPerPageOptions, initialPage, initialPageSize]);

  return pagination;
}