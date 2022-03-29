import { h, ComponentChildren } from 'preact';
import { Container, Row, Col } from 'react-bootstrap';

const Page = ({
  wide,
  title,
  heading,
  children,
}: {
  wide?: boolean;
  title?: string;
  heading: string;
  children: ComponentChildren;
}) => {
  if (title) document.title = `La Corazón - ${title}`;
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ span: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className="mt-1">
            <h1>{heading}</h1>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
