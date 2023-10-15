import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
    Container,
    Button,
    Row,
    Col,
    Form,
    FormControl
} from "react-bootstrap";

export default function Signup(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    const onSignupClick = () => {
        const userData = {
            username: username,
            password: password
        };
    }

    return (
        <Container>
        <Row>
          <Col md="4">
            <h1>Sign up</h1>
            <Form>
              <Form.Group controlId="usernameId">
                <Form.Label>User name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter user name"
                  value={username}
                  onChange={onChange}
                />
                <FormControl.Feedback type="invalid"></FormControl.Feedback>
              </Form.Group>

              <Form.Group controlId="passwordId">
                <Form.Label>Your password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={onChange}
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>
            </Form>
            <Button 
              color="primary"
              onClick={onSignupClick}  
            >Sign up</Button>
            <p className="mt-2">
              Already have account? <NavLink to="/login">Login</NavLink>
            </p>
          </Col>
        </Row>
      </Container>
    )
}