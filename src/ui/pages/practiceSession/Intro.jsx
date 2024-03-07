import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { user } from '../../../storage/store';

const useStyles = makeStyles({
  table: {
    marginTop: '20px',
    width: 600,
  },
});

function createData(name, role, fat, carbs, protein) {
  return { name, role, fat, carbs, protein };
}

const TherapistRows = [
  createData('Your role', 'Host'),
  createData('Your peers role', 'Participant'),
  createData('Your goal', 'Lead the session and pin moments you are doing well or poorly.'),
];

const ClientRows = [
  createData('Your role', 'Participant'),
  createData('Your peers role', 'Host'),
  createData('Your goal', 'Role-play as a participant and use pins to assess your peer’s skills'),
];

const Intro = () => {
  const classes = useStyles();
  const user = useSelector(state => state.user);
  var rows = TherapistRows;
  if (user.userMode == 'callee') {
    rows = ClientRows;
  }
  return (
    <div>
      <Box align="center" m={6}>
        <Typography variant="h4" style={{ textAlign: 'left', width: '50%' }}>
          Now, it’s time to step into the practice session.
        </Typography>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {rows.map(row => (
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
};

export default Intro;
