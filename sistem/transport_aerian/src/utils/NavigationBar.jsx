import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import companyLogo from "../media/TOMAir-removebg-preview.png";

function NavigationBar() {
  const [user, setUser] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={companyLogo}
              height="60px"
              width="60px"
              alt="company logo"></img>
            TOMAir
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/#/login">Sign in</Nav.Link>
            <Nav.Link href="/#/create-account">Sign up</Nav.Link>
            {user === "" ? (
              <Nav.Link href="/#/login">My account</Nav.Link>
            ) : (
              <Nav.Link href="/#/my-account">{user}</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
