import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

import ColorLibButton, { ColorLibNextButton, ColorLibBackButton } from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import ColorLibPaper from './ColorLibComponents/ColorLibPaper';

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '25px',
        fontWeight: '600',
    },
    page: {
        margin: '24px 0px',
    },
    pageTitle: {
        fontSize: '20px',
        fontWeight: '600',
    },
}));

const getPageTitle = (page) => {
    switch(page) {
        case 0: return "Based on today’s session";
        case 1: return "Make a plan";
        case 2: return "Prepare for change";
        default: return "";
    }
}

const getPageContent = (page) => {
    switch(page) {
        case 0: return (
            <div>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What do I feel like are my strengths?                              
                </Box>
                <Box>
                    <ColorLibTextField
                            id="outlined-secondary"
                            label="Type a strength and press Enter to add"
                            fullWidth
                            variant="outlined"
                            multiline
                            rowsMax={2}
                            margin="normal"
                    />
                </Box>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What are some opportunities for growth?
                </Box>
                <Box>
                    <ColorLibTextField
                            id="outlined-secondary"
                            label="Type and opportunity and press Enter to add"
                            fullWidth
                            variant="outlined"
                            multiline
                            rowsMax={2}
                            margin="normal"
                    />
                </Box>
            </div>
        );
        case 1: return (
            <div>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What steps will I take to improve?
                </Box>
                <Box>
                    <ColorLibTextField
                            id="outlined-secondary"
                            fullWidth
                            variant="outlined"
                            multiline
                            rowsMax={2}
                            margin="normal"
                    />
                </Box>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What obstacles might get in the way, and how will I overcome them?
                </Box>
                <Box>
                    <ColorLibTextField
                            id="outlined-secondary"
                            fullWidth
                            variant="outlined"
                            multiline
                            rowsMax={2}
                            margin="normal"
                    />
                </Box>
            </div>
        );
        case 2: return (
            <div>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What would I like to add to my clinical practice?
                </Box>
                <Box>
                    <ColorLibTextField
                        id="outlined-secondary"
                        fullWidth
                        variant="outlined"
                        multiline
                        rowsMax={2}
                        margin="normal"
                    />
                </Box>
                <Box textAlign="left" fontSize={18} fontWeight="fontWeightMedium" > 
                    What else would I like to keep reflecting on during the next week?
                </Box>
                <Box>
                    <ColorLibTextField
                            id="outlined-secondary"
                            fullWidth
                            variant="outlined"
                            multiline
                            rowsMax={2}
                            margin="normal"
                    />
                </Box>
            </div>
        )
        default: return <div />;
    }
}

const getPageButtons = (page, setPage) => {
    const handleNext = () => {
        setPage(page+1);
    }
    const handleBack = () => {
        setPage(page-1);
    }
    switch(page) {
        case 0: return (
            <ColorLibNextButton 
                variant="contained" 
                size="medium" 
                onClick={handleNext}
            >
                Next
            </ColorLibNextButton>
        );
        case 1: return (
            <div>
                <ColorLibBackButton 
                    variant="outlined" 
                    size="medium"
                    onClick={handleBack}
                >
                    Back
                </ColorLibBackButton>
                <ColorLibNextButton 
                    variant="contained" 
                    size="medium" 
                    onClick={handleNext}
                >
                    Next
                </ColorLibNextButton>
            </div>
        );
        case 2: return (
            <div>
                <ColorLibBackButton 
                    variant="outlined" 
                    size="medium"
                    onClick={handleBack}
                >
                    Back
                </ColorLibBackButton>
                <ColorLibButton 
                    variant="contained"
                    size="medium"
                    href="/completion"
                >
                    Finish Self-Reflection
                </ColorLibButton>
            </div>
        );
        default: return <div />;
    }
}

const SelfReflection = () => {
    const [page, setPage] = useState(0);
    const classes = useStyles();

    return (
        <Container maxWidth = 'md'>
            <Typography className={classes.title}>
                Reflect on how the session went and how you felt.
            </Typography>
            <ColorLibPaper className={classes.page}>
                <Typography className={classes.pageTitle}>
                    {getPageTitle(page)}
                </Typography>  
                {getPageContent(page)}
                <div 
                    style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '20px 0 0 0'
                    }}
                >
                    {getPageButtons(page, setPage)}
                </div>
            </ColorLibPaper>
        </Container>
    );
}
 
export default SelfReflection;