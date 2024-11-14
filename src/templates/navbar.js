import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Button, Image} from "react-bootstrap";
import './navbarWebsite.css';

function NavbarSite() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };
    return (
        <Navbar collapseOnSelect className="bg-body-tertiary" fixed="top">
            <Container>
                <Navbar.Brand href="#home">Signature Website</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Nav className="me-auto">
                        {profile ? (
                            <>
                        <Nav.Link href="/timestamp">Timestamp Service</Nav.Link>
                        <Nav.Link href="#closed">Closed Workflows</Nav.Link>
                            </>
                            ):(
                            <Nav.Link href="#features">About</Nav.Link>
                            )}
                    </Nav>
                    <Nav>
                        <Navbar.Text className="ms-2">
                            {profile ? (
                                <NavDropdown
                                    title={
                                        <Image
                                            src={profile.picture}
                                            roundedCircle
                                            alt="user image"
                                            width="30"
                                            height="30"
                                        />
                                    }
                                    id="collapsible-nav-dropdown"
                                    align="end"
                                    className="no-caret"
                                >
                                    <NavDropdown.ItemText>
                                        {profile.name}
                                    </NavDropdown.ItemText>
                                    <NavDropdown.ItemText>
                                        {profile.email}
                                    </NavDropdown.ItemText>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logOut}>
                                        Log out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Button variant="primary" onClick={login}>Sign in with Google 🚀 </Button>
                            )}
                        </Navbar.Text>
                    </Nav>
            </Container>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
                crossOrigin="anonymous"
            />
        </Navbar>

    );
}

export default NavbarSite;
