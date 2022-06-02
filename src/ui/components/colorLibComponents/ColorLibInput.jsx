import { makeStyles, withStyles } from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
const CustomizedInput = withStyles(theme => ({
  root: {
    '& .MuiInputLabel-outlined': {
      color: theme.palette.gray.main,
      opacity: '60%',
    },
    '& .MuiInputBase-input': {
      color: theme.palette.gray.main,
    },
    '& .MuiInputBase-root.Mui-disabled': {
      opacity: '50%',
      borderColor: '1px solid ' + theme.palette.teal.light,
      '& fieldset': {
        borderColor: theme.palette.teal.light,
        borderWidth: '1.5px',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.teal.light,
        borderWidth: '1.5px',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.teal.light,
        borderWidth: '1.5px',
      },
    },
    '& .MuiOutlinedInput-root': {
      background: 'white',
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
      },
    },
    '&.MuiFormControl-marginNormal': {
      margin: '8px 0px 24px 0px',
    },
  },
}))(Input);

const ColorLibTextField = props => {
  return <CustomizedInput {...props} />;
};

export default ColorLibTextField;
