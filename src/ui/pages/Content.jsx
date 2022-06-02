import Steppers from '../components/Steppers';
import Modules from './Modules';
import Container from '@material-ui/core/Container';

// main content component
const Content = () => {
  return (
    <section>
      <Container maxWidth="md">
        <Steppers />
      </Container>
      <Modules />
    </section>
  );
};

export default Content;
