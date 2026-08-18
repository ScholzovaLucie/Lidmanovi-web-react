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
    <TableContainer
      sx={{
        // Bez explicitního minWidth:0 zdědí tabulka svou intrinzickou šířku
        // od nadřazeného flex/Stack kontejneru a do strany se pak posouvá
        // celá stránka místo téhle komponenty - proto to tady "utínáme".
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Table sx={{ minWidth: 650, ...sx }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align || "left"}
                sx={{
                  bgcolor: "grey.50",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  ...col.headerSx,
                }}
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
            data.map((row, rowIndex) => {
              // Sudé/liché řádky mají jinou barvu (zebra) - "přilepený" sloupec
              // musí mít vlastní neprůhledné pozadí ve stejném rytmu, jinak by
              // jím při scrollu prosvítal obsah ostatních sloupců pod ním.
              const rowBg = rowIndex % 2 === 1 ? "action.hover" : "background.paper";

              return (
                <TableRow
                  key={resolveRowId(row, rowIndex)}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    bgcolor: rowBg,
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
              );
            })
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
