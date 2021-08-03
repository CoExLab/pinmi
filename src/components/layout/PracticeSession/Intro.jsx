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
    },
  });


function createData(name, role, fat, carbs, protein) {
    return { name, role, fat, carbs, protein };
  }
  
  const rows = [
    createData('Your role', 'Therapist', 6.0, 24, 4.0),
    createData('Your peers role', 'Client', 237, 9.0, 37, 4.3),
    createData('Your goal', 'Build rapport and analyze the client’s situation', 262, 16.0, 24, 6.0),
  ];
  
const Intro = () => {
    const classes = useStyles();
    return (  
      <div>
        <Box align="center" m = {2}>
             <h1>Now, it’s time to step into the practice session and practice using open-ended questions.</h1>
            <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
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


export default Intro;
