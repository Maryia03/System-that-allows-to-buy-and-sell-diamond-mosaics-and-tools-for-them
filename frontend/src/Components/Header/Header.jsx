import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav, Modal, Button } from 'react-bootstrap';
import logo from './LogoMosaic.png';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import LogIn from '../Pages/LogIn';
import Cookies from 'js-cookie'

const Header = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const handleLoginModalClose = () => setShowLoginModal(false);
    const handleLoginModalShow = () => setShowLoginModal(true);

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    return (
        <Navbar collapseOnSelect expand="md" bg="light" variant="light" className="no-padding">
            <Container fluid className="no-padding">
                <Navbar.Brand as={Link} to="/home" className="logo-container">
                    <img src={logo} className="d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link as={Link} to="/">Mosaics</Nav.Link>
                        <Nav.Link as={Link} to="/tool">Tools</Nav.Link>
                        <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                        <Nav.Link as={Link} to="/orders">Moje Zamówienia</Nav.Link>
                        {!Cookies.get('user_id') ? (
                            <>
                                <Nav.Link onClick={handleLoginModalShow}>Logowanie</Nav.Link>
                                <Nav.Link as={Link} to="/register">Rejestracja</Nav.Link>
                            </>
                        ) : (
                            <>

                                {/* Link do panelu administracyjnego, jeśli użytkownik jest administratorem */}
                                {Cookies.get('admin') == "1" && (
                                    <Nav.Link as={Link} to="/admin">Panel Administratora</Nav.Link>
                                )}

                                <Nav.Link as={Link} to="/" onClick={handleLogout}>Wyloguj się</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            {/* Modal logowania */}
            <Modal show={showLoginModal} onHide={handleLoginModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Logowanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LogIn handleClose={handleLoginModalClose} />
                </Modal.Body>
            </Modal>
        </Navbar>
    );
};

export default Header;
