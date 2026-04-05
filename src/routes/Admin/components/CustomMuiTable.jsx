import { Alert, Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

export default function CustomTable({
  columns = [],
  data = [],
  getRowId,
  sx,
  // Nové jednoduché API - jeden objekt místo 8+ parametrů
  paginationConfig = null,
}) {
  const resolveRowId = (row, index) => {
    if (getRowId) return getRowId(row);
    if (row.id) return row.id;
    return index;
  };

  const getNestedValue = (obj, path) => {
    if (!path) return undefined;
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    if (!paginationConfig) return;

    const currentPageZeroBased = paginationConfig.pageIndex;

    if (newPage > currentPageZeroBased) {
      paginationConfig.nextPage?.();
    } else if (newPage < currentPageZeroBased) {
      paginationConfig.previousPage?.();
    }
  };

  const handleRowsPerPageChange = (event) => {
    if (!paginationConfig) return;

    const newPageSize = parseInt(event.target.value, 10);
    paginationConfig.changePageSize?.(newPageSize);
  };

  if (!data) {
    return <Alert severity="error">Data pro tabulku nejsou k dispozici.</Alert>;
  }

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650, ...sx }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align || "left"}
                sx={col.headerSx}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography color="text.secondary">
                  Žádná data nenalezena.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={resolveRowId(row, rowIndex)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                {columns.map((col) => {
                  const value = getNestedValue(row, col.key);

                  return (
                    <TableCell
                      key={col.key}
                      align={col.align || "left"}
                      sx={{ verticalAlign: "top", ...col.cellSx }}
                    >
                      {col.render ? col.render(row, value, rowIndex) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>

        {paginationConfig && (
          <TableFooter>
            <TableRow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
              <TablePagination
                rowsPerPageOptions={paginationConfig.rowsPerPageOptions}
                colSpan={columns.length}
                count={paginationConfig.totalCount}
                rowsPerPage={paginationConfig.pageSize}
                page={paginationConfig.pageIndex}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Řádků na stránku:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}–${to} z ${count !== -1 ? count : `více než ${to}`}`
                }
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
}
