import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function CustomTable({ columns = [], data = [], getRowId, sx }) {
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

  return (
    <TableContainer component={Paper}>
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
          {data.map((row, rowIndex) => (
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
                    sx={col.cellSx}
                  >
                    {col.render ? col.render(row, value, rowIndex) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
