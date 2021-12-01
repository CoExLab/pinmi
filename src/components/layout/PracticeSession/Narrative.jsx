import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { user } from '../../Store';

const useStyles = makeStyles({
  table: {
    width: 600,
  },
});


function createData(name, role, fat, carbs, protein) {
  return { name, role, fat, carbs, protein };
}

const rows = [
  createData('Full Name', 'Julia Rogers', 6.0, 24, 4.0),
  createData('Reason for appointment', 'I’m going through a hard time and I’m not sure what to do.', 262, 16.0, 24, 6.0),
];

const ClientRows = [
  createData('Full Name', 'Julia Rogers', 6.0, 24, 4.0),
  createData('Reason for appointment', 'I’m going through a hard time and I’m not sure what to do.', 262, 16.0, 24, 6.0),
];


const Narrative = () => {
  const classes = useStyles();
  const user = useSelector(state => state.user);
  return (
    <div>
      <Box align="center" m={6}>
        <Typography variant="h4">
          Client Information
        </Typography>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Box fontWeight="fontWeightBold">{row.name}</Box>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.role}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}


export default Narrative;