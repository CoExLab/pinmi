import React from 'react';
import {Box, Grid, Link, Dialog, DialogContent, Typography, IconButton, List, ListItem, ListItemText, ListItemIcon, Divider} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const MISkillsSheet = ({pinType}) => {

    const [skillInfoOpened, setSkillInfoOpened] = React.useState(false);
    const str1 = "were used here? ";
    const str2 = "could have been used here? ";
    const styles = (theme) => ({
        root: {
          margin: 0,
          padding: theme.spacing(2),
        },
        closeButton: {
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: theme.palette.grey[500],
        },
      });

    const DialogTitle = withStyles(styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
          <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
              <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            ) : null}
          </MuiDialogTitle>
        );
    });

    const handleClose = () => {
        setSkillInfoOpened(false);
        console.log(pinType);
    };

    const handleClickOpen = () => {
        setSkillInfoOpened(true);
    };

    return (
        <div>
            {pinType === undefined ? null : 
            <div>
            <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" m={1}> 
                What   
                <Link href="#" onClick={() => {handleClickOpen()}}>
                    {" MI skills "}
                </Link>
                
                {pinType === "strength" ? str1 : str2}
            </Box>   
            <Dialog onClose={handleClose} open={skillInfoOpened}>
                <DialogTitle onClose={handleClose} align="center">
                    <Box fontWeight="fontWeightBold">  What are the four core MI skills? </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Box m={0.5} height={500} overflow="auto">
                    <Typography component="div">
                        <Box fontWeight="fontWeightRegular" m={1} mb = {2} >
                            OARS is a skills-based, client-centered model of interactive techniques. 
                            Using these skills will help establish and maintain rapport with your client, 
                            assess your client’s needs, and personalize your counseling and education responses.   
                        </Box>
                        <Box fontWeight="fontWeightBold"  fontSize= {16}>
                            Open-ended questions
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Establish a safe environment and help to build rapport and a trusting and respectful professional relationship."}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Explore, clarify and gain an understanding of your client’s world."}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Learn about your client’s experiences, thoughts, feelings, beliefs, and hopes for the future."}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>                                
                        <Box fontWeight="fontWeightBold"  fontSize= {14} >
                            You may ask:
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"What... brings you to the clinic today?"}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"When... if ever, might you want to be a parent?"}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Where... will you get the support you need?"}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>    
                        <Divider light = {true} />
                        <Box fontWeight="fontWeightBold"  fontSize= {16} pt = {3}>
                            Affirmations
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Build rapport, demonstrate empathy, and affirm your client’s strengths and abilities."}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Build on your client’s level of self-efficacy and share a belief that they can be responsible for their own decisions and life choices."}
                                    />
                                    </ListItem>       
                                </List>
                            </div>
                        </Grid>   
                        <Box fontWeight="fontWeightBold"  fontSize= {14} >
                            You may ask:
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"It’s great that you are here today. It’s not always easy..."}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"It sounds like you’ve been really thoughtful about your decision."}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"You’re really trying hard to..."}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>  
                        <Divider light = {true} />
                        <Box fontWeight="fontWeightBold"  fontSize= {16} pt = {3}>
                            Reflective Listening
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Listen to your client to help you gain a deeper understanding of their life."}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Listen, observe, and share (reflect on) your own perceptions of what your client shares."}
                                    />
                                    </ListItem>        
                                </List>
                            </div>
                        </Grid> 
                        <Box fontWeight="fontWeightBold"  fontSize= {14} >
                            You can reflect words, emotions, and/or behaviors:
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Reflecting words (Some of what I heard you say...)"}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Reflecting emotions (You seem [to be feeling]...)"}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Reflecting behavior (I noticed...)"}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>  
                        <Divider light = {true} />
                        <Box fontWeight="fontWeightBold"  fontSize= {16} pt = {3}>
                            Summary
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Help move the conversation from the beginning, through the middle to closing."}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Check that you are understanding your client’s goals and preferences."}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"Confirm that your client has an understanding of the key elements of a plan."}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>                                
                        <Box fontWeight="fontWeightBold"  fontSize= {14} >
                            Summarizing can be demonstrated in three ways:
                        </Box>
                        <Grid item xs={12}>
                            <div >
                                <List dense={true}>
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"A collective summary (So let’s go over what we have talked about so far.)"}
                                    />
                                    </ListItem>
                                    <ListItem >
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"A linking summary (A minute ago you said you wanted to talk to your partner... Would you like to talk more about how you might try?)"}
                                    />
                                    </ListItem>                                            
                                    <ListItem>
                                    <ListItemIcon style={{minWidth: '25px'}}>
                                        <FiberManualRecordIcon style={{ fontSize: '50%' }}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={"A transitional summary to close (So you’ve just described your plan. We’re always here to help in any way. What other questions do you have before you leave today?)"}
                                    />
                                    </ListItem>
                                </List>
                            </div>
                        </Grid>    
                        <Divider light = {true} />

                        <Box fontWeight="fontWeightLight"  fontSize= {14} pt = {3}>
                            Source: Reproductive Health National Training Center OARS Handout
                        </Box>
                    </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
            </div>
            }
        </div>
    );
};

export default MISkillsSheet;