import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "../Style/App.css";

// Defines the style for changing color of every other row in table
const StyledTableRow = styled(TableRow)(({}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#D9D9D9",
  },
}));

function FriendsTable({ rows }) {
  return (
    <div className="Friends">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow>
                <TableCell>{row.rank}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.output}</TableCell>
                {/* <TableCell align="center">{row.prev_rank}</TableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FriendsTable;
