import { useSelector } from 'react-redux';
import Steppers from '../components/Steppers';
import Modules from './Modules';
import Container from '@material-ui/core/Container';

// main content component
const Content = () => {
  const session = useSelector(state => state.session);

  return (
    <section>
      {session.recordOnly !== true && (
        <Container maxWidth="md">
          <Steppers />
        </Container>
      )}
      <Modules />
    </section>
  );
};

export default Content;
