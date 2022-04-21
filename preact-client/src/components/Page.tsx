import { h, ComponentChildren, Fragment } from 'preact';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const Page = ({
  wide,
  title,
  heading,
  errors,
  error,
  children,
}: {
  wide?: boolean;
  title?: string;
  heading: string;
  errors?: (Error | string)[] | null;
  error?: (Error | string) | null;
  children: ComponentChildren;
}) => {
  if (title) document.title = `La Corazón - ${title}`;
  const errs = (error && [error]) || errors || [];
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ span: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className="mt-1">
            <h1>{heading}</h1>
            {errs.length ? (
              <>
                {errs.map((error) =>
                  error ? (
                    <Alert variant="warning">{error.toString()}</Alert>
                  ) : null
                )}
              </>
            ) : (
              children
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
