import { makeStyles, withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const ColorLibPaper = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.teal.lighter,
    boxShadow: 'none',
    padding: '50px 80px',
  },
  rounded: {
    borderRadius: '30px',
  }
}))(Paper);
export default ColorLibPaper;