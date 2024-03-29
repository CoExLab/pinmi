import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import ColorLibButton from './ColorLibButton';

const ColorLibTimeReminder = ({ open, setOpen, recommendedMinutes, nextSection }) => {
  const dialogStyle = {
    fontFamily: 'Lato, sans-serif', // Set the font family to Lato
  };

  return (
    <Dialog
      open={open}
      onClose={null}
      aria-labelledby="timer-dialog-title"
      aria-describedby="timer-dialog-description"
      style={dialogStyle}
    >
      <DialogTitle>Time Reminder</DialogTitle>
      <DialogContent>
        <Box m={1}>You have spent {recommendedMinutes} minutes in the section.</Box>
        <Box m={1}>Time to wrap up the conversation and begin {nextSection}.</Box>
      </DialogContent>
      <DialogActions>
        <ColorLibButton variant="contained" size="small" onClick={() => setOpen(false)} autoFocus>
          Close
        </ColorLibButton>
      </DialogActions>
    </Dialog>
  );
};

export default ColorLibTimeReminder;
