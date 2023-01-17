import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Papaparse from "papaparse";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {};
  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>React Github Issues Creator</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="token" className="mb-3">
              <Form.Label>Token</Form.Label> <br />
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload an CSV</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={changeHandler}
                accept=".csv"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
