import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useRef, React } from 'react';

import ColorLibButton, { ColorLibNextButton, ColorLibBackButton } from './ColorLibComponents/ColorLibButton';
import ColorLibTextField from './ColorLibComponents/ColorLibTextField';
import ColorLibPaper from './ColorLibComponents/ColorLibPaper';

import firebase from 'firebase';
import { useSessionValue } from '../../context';

const getPageTitle = (page) => {
    switch(page) {
        case 0: return "Based on today’s session";
        case 1: return "Make a plan";
        case 2: return "Prepare for change";
        default: return "";
    }
}

const GetPageContent = ({page}) => {
    const [strength, setStrength] = useState('');
    const [opp, setOpp] = useState('');
    const [nextSteps, setNextSteps] = useState('');
    const [obstacles, setObstacles] = useState('');
    const [practice, setPractice] = useState('');
    const [addReflect, setAddReflect] = useState('');

    const strengthRef = useRef('');
    const oppRef = useRef('');
    const nextStepsRef = useRef('');
    const obstaclesRef = useRef('');
    const practiceRef = useRef('');
    const addReflectRef = useRef('');

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
                            value={strength}
                            inputRef={strengthRef}
                            onChange={() => setStrength(strengthRef.current.value)}
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
                            value={opp}
                            inputRef={oppRef}
                            onChange={()=>setOpp(oppRef.current.value)}
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
                            value={nextSteps}
                            inputRef={nextStepsRef}
                            onChange={() => setNextSteps(nextStepsRef.current.value)}
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
                            value={obstacles}
                            inputRef={obstaclesRef}
                            onChange={() => setObstacles(obstaclesRef.current.value)}
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
                        value={practice}
                        inputRef={practiceRef}
                        onChange={() => setPractice(practiceRef.current.value)}
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
                            value={addReflect}
                            inputRef={addReflectRef}
                            onChange={() => setAddReflect(addReflectRef.current.value)}
                    />
                </Box>
            </div>
        )
        default: return <div />;
    }
}

const getPageButtons = (page, setPage, makeReflectionDoc) => {
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
                    onClick={()=>makeReflectionDoc()}
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
    const {sessionID} = useSessionValue();

    const [page, setPage] = useState(0);

    const childRef = React.createRef();

    const makeReflectionDoc = async () => {
        const currentInput = this.childRef.current;
        await firebase.firestore().collection("reflection").doc(sessionID).set({
            strength: currentInput.state.strength,
            opportunity: currentInput.state.opp,
            nextSteps: currentInput.state.nextSteps,
            obstacles: currentInput.state.obstacles,
            practice: currentInput.state.practice,
            additional: currentInput.state.addReflect
        })
    }

    return (
        <Container maxWidth = 'md'>
            <Typography variant='h2'>
                Reflect on how the session went and how you felt.
            </Typography>
            <ColorLibPaper 
                elevation={0}
                style={{margin:'24px 0px'}}
            >
                <Typography variant='h4'>
                    {getPageTitle(page)}
                </Typography>  
                <GetPageContent ref={childRef} props={page}/>
                <div 
                    style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '20px 0 0 0'
                    }}
                >
                    {getPageButtons(page, setPage, makeReflectionDoc)}
                </div>
            </ColorLibPaper>
        </Container>
    );
}
 
export default SelfReflection;