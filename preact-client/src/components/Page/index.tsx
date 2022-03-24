import { h, FunctionComponent } from 'preact';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './styles.module.css';

const Page: FunctionComponent<{
  wide?: boolean;
  title?: string;
  heading: string;
  action?: React.ReactNode;
}> = ({ wide, title, heading, action }) => {
  if (title) document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ span: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className={styles.spacing}>
            <h1 className={styles.heading}>{heading}</h1>
            <div className={styles.action}>{action}</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
