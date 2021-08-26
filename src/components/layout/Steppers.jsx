import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Step, StepConnector, Stepper, StepLabel} from '@material-ui/core';
import {makeStyles, withStyles} from '@material-ui/core/styles';
// icons import
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import CreateIcon from '@material-ui/icons/Create';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import PersonIcon from '@material-ui/icons/Person';
import RefreshIcon from '@material-ui/icons/Refresh';
import DoneIcon from '@material-ui/icons/Done';
// context
import { useActiveStepValue } from "../../context";



const useColorlibStepIconStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.gray.light,
		zIndex: 1,
		color: 'white',
		width: 50,
		height: 50,
		display: 'flex',
		borderRadius: '50%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	active: {
		backgroundColor: theme.palette.pink.dark,
		boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
	},
	completed: {
		backgroundColor:
		theme.palette.pink.main,
	},
	space: {
		marginTop: 100,
	}
}));

function ColorlibStepIcon(props) {
	const classes = useColorlibStepIconStyles();
	const { active, completed } = props;
	
	const icons = {
		1: <RefreshIcon />,
		2: <VoiceChatIcon />,
		3: <CreateIcon />,
		4: <QuestionAnswerIcon />,
		5: <PersonIcon />,
		6: <DoneIcon />
	};
	
	return (
		<div
		className={clsx(classes.root, {
			[classes.active]: active,
			[classes.completed]: completed,
		})}
		>
			{icons[String(props.icon)]}
		</div>
	);
	}

ColorlibStepIcon.propTypes = {
	/**
	 * Whether this step is active.
	 */
	active: PropTypes.bool,
	/**
	 * Mark the step as completed. Is passed to child components.
	 */
	completed: PropTypes.bool,
	/**
	 * The label displayed in the step icon.
	 */
	icon: PropTypes.node,
};

const ColorlibConnector = withStyles((theme) => ({
	alternativeLabel: {
	 top: 22,
	},
	active: {
	 '& $line': {
		backgroundColor: theme.palette.pink.dark,
	 },
	},
	completed: {
	 '& $line': {
		backgroundColor: theme.palette.pink.main,
	 },
	},
	line: {
	 height: 3,
	 border: 0,
	 backgroundColor: theme.palette.gray.light,
	 borderRadius: 1,
	},
 }))(StepConnector);

const Steppers = () => {
	const steps = ['MI Refresher', 'Practice Session', 'Discussion Prep', 'Collaborative Discussion', 'Self-Reflection', 'Complete'];
	const {curActiveStep: activeStep} = useActiveStepValue();

	return (
		<div>
			<Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
			{steps.map((label) => (
				<Step key={label}>
				<StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
				</Step>
			))}
			</Stepper>
		</div>
	);
}
 
export default Steppers;