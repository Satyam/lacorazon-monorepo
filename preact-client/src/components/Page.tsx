import { h, ComponentChildren } from 'preact';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  CloseButton,
} from 'react-bootstrap';
import { useQueryError } from 'providers/Query';

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
  const { clearErrors, errors } = useQueryError();
  if (title) document.title = `La Corazón - ${title}`;
  const onCloseError = () => {
    clearErrors();
  };
  return (
    <Container fluid>
      <Row>
        <Col sm="12" md={{ span: wide ? 12 : 8, offset: wide ? 0 : 2 }}>
          <div className="mt-1">
            <h1>{heading}</h1>
            {errors.length ? (
              <Card bg="warning">
                <Card.Header>
                  Errores
                  <CloseButton className="float-end" onClick={onCloseError} />
                </Card.Header>
                <ListGroup>
                  {errors.map(({ where, message }) => (
                    <ListGroup.Item>
                      {`"${where}" reports an error:`}
                      <br />
                      {`${message}`}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
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
