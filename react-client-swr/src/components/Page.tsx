import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  CloseButton,
} from 'react-bootstrap';
import { useErrorsContext } from 'providers/ErrorsContext';

const Page = ({
  wide,
  title,
  heading,
  children,
  onClose,
}: {
  wide?: boolean;
  title?: string;
  heading: string;
  children: React.ReactNode;
  onClose?: () => void;
}) => {
  const { clearErrors, errors } = useErrorsContext();
  if (title) document.title = `La Corazón - ${title}`;
  const onCloseError = () => {
    clearErrors();
    if (onClose) onClose();
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
                  {errors.map(({ error, context }, index) => (
                    <ListGroup.Item key={index}>
                      <>
                        {context}
                        <br />
                        {typeof error === 'object' && 'data' in error
                          ? error.data
                          : error}
                      </>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card.Footer>
                  El sistema seguirá reintentando. Cerrar este cartel para
                  continuar ==&gt;
                  <CloseButton className="float-end" onClick={onCloseError} />
                </Card.Footer>
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
