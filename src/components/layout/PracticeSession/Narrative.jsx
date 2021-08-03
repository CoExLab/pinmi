import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';


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
    createData('Age', 28, 237, 9.0, 37, 4.3),
    createData('Gender', 'F', 262, 16.0, 24, 6.0),
    createData('Reason for appointment', 'I’m going through a hard time and I’m not sure what to do.', 262, 16.0, 24, 6.0),
  ];

  
const Narrative = () => {
    const classes = useStyles();
    return (  
        <div>
            <Box align="center" m = {2}>
            <h1> Client Information </h1>
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