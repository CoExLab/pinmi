import { makeStyles, withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

// const ColorLibTextField = withStyles((theme) => ({
//   root: {
//     marginTop: '8px',
//     '&.MuiInputLabel-root': {
//       color: theme.palette.teal.main,
//     },
//   }
// }))(TextField);

const ColorLibTextField = withStyles((theme) => ({
  root: {
    '& .MuiInputLabel-outlined': {
      color: theme.palette.gray.main,
      opacity: '60%',
    },
    '& .MuiInputBase-input': {
      color: theme.palette.gray.main,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px',
      '& fieldset': {
        borderColor: theme.palette.teal.light,
        borderWidth: '1.5px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.teal.main,
        borderWidth: '1.5px',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.teal.main,
        borderWidth: '1.5px',
      }
    }
  }
}))(TextField);

export default ColorLibTextField;