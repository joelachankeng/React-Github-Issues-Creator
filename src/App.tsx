import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Papaparse from "papaparse";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

interface iIssue {
  title: string;
  body?: string;
  assignees?: string | string[];
  milestone?: string;
  labels?: string | string[];
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const uploadIssues = async (issue: iIssue) => {
    return new Promise(async (resolve, reject) => {
      if (issue.assignees && typeof issue.assignees === "string")
        issue.assignees = issue.assignees.split(",");

      if (issue.labels && typeof issue.labels === "string") {
        let labels = issue.labels.split(",");
        labels.forEach((l) => l.trim());
        issue.labels = labels;
      }

      if (!issue.milestone) {
        delete issue.milestone;
      }

      console.log("updated Issue", issue);

      await axios
        .request({
          method: "POST",
          url: "https://api.github.com/repos/heatherstoneio/opus-plugins/issues",
          headers: {
            Authorization: `token ${token}`,
          },
          data: issue,
        })
        .then(function (response) {
          console.log(response);
          resolve(response);
        })
        .catch(function (error) {
          console.log("upload error ", error);
          reject(error);
        });
    });
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const getFile = event?.target?.files?.[0];
    setSelectedFile(getFile);
    // console.log(getFile);
  };

  const submitHandler = () => {
    if (!selectedFile) {
      setErrorMessage("Github Token required.");
      return;
    }

    Papaparse.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results: any) {
        console.log("results", results.data);
        for (let index = 0; index < results.data.length; index++) {
          const result: iIssue = results.data[index];
          await uploadIssues(result);
        }
      },
    });
  };

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
              <Form.Control
                type="text"
                onChange={(e) => {
                  setToken(e.target.value);
                }}
              />
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
            <Button
              variant="primary"
              type="submit"
              className="mt-2"
              onClick={submitHandler}
            >
              Submit
            </Button>
            <p>{errorMessage}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
