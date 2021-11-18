import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import ColorLibButton from './ColorLibButton';

const ColorLibTimeReminder = ({
    open,
    setOpen,
    recommendedMinutes,
    nextSection
}) => (
    <Dialog
        open={open}
        onClose={null}
        aria-labelledby="timer-dialog-title"
        aria-describedby="timer-dialog-description"
    >
        <DialogTitle>
            Time Reminder
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="timer-dialog-description">
                <Box m={1}>You have spent {recommendedMinutes} minutes in the section.</Box>
                <Box m={1}>Time to wrap up the conversation and begin {nextSection}.</Box>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <ColorLibButton
                variant='contained'
                size='small'
                onClick={
                    () => setOpen(false)
                }
                autoFocus
            >
                Close
            </ColorLibButton>
        </DialogActions>
    </Dialog>
);

export default ColorLibTimeReminder;