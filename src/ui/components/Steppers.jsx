import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Step, StepConnector, Stepper, StepLabel } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// icons import
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import CreateIcon from '@material-ui/icons/Create';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import PersonIcon from '@material-ui/icons/Person';

// context
import { useActiveStepValue } from '../../storage/context';

const useStepperStyles = makeStyles(theme => ({
  stepper: {
    marginTop: '30px',
  },
}));

const useColorlibStepIconStyles = makeStyles(theme => ({
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
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: theme.palette.pink.light,
  },
  space: {
    marginTop: 100,
  },
}));

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <VoiceChatIcon />,
    2: <CreateIcon />,
    3: <QuestionAnswerIcon />,
    4: <PersonIcon />,
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

const ColorLibLabel = withStyles(theme => ({
  root: {
    '& .MuiStepLabel-active': {
      color: theme.palette.pink.dark,
      fontSize: '20px',
      fontWeight: 'bold',
      marginTop: '-84px !important',
      opacity: '100%',
      whiteSpace: 'nowrap',
    },
    '& .MuiStepLabel-completed': {
      color: theme.palette.pink.light,
    },
  },
  label: {
    color: theme.palette.teal.main,
    marginTop: '-80px !important',
    opacity: '70%',
  },
}))(StepLabel);

const ColorlibConnector = withStyles(theme => ({
  alternativeLabel: {
    top: 22,
    left: 'calc(-50% + 0px)',
    right: 'calc(50% + 0px)',
  },
  active: {
    '& $line': {
      backgroundColor: theme.palette.pink.light,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: theme.palette.pink.light,
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
  const steps = ['Practice Session', 'Discussion Prep', 'Discussion', 'Self-Reflection'];
  const classes = useStepperStyles();
  const { setCurActiveStep: setActive, curActiveStep: activeStep } = useActiveStepValue();

  const handleStep = step => () => {
    setActive(step);
  };

  return (
    <div>
      <Stepper
        nonLinear
        className={classes.stepper}
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {steps.map((label, index) => (
          <Step key={label} onClick={handleStep(index)}>
            <ColorLibLabel StepIconComponent={ColorlibStepIcon}>{label}</ColorLibLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default Steppers;
