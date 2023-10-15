import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";


export default function Home() {
    return (
        <Container>
            <h1>Home</h1>
            <p>
                <NavLink to="/login/">Login</NavLink>
            </p>
            <p>
                <NavLink to="/signup">Sign up</NavLink>
            </p>
            <p>
                <NavLink to="/dashboard">Dashboard</NavLink>
            </p>
      </Container>
    )
}