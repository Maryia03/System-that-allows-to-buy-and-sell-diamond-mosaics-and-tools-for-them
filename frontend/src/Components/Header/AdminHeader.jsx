import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../../Context/AuthContext';

const AdminHeader = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    return (
        <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light" className="navbar">
            <Container>
                <Navbar.Brand as={Link} to="/admin" className="logo-container">
                    Panel Administratora
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="navbar-nav">
                        <Nav.Link as={Link} to="/admin/users">Użytkownicy</Nav.Link>
                        <Nav.Link as={Link} to="/admin/mosaics">Mosaics</Nav.Link>
                        <Nav.Link as={Link} to="/admin/tools">Tools</Nav.Link>
                        <Nav.Link as={Link} to="/admin/orders">Orders</Nav.Link>
                        <Nav.Link as={Link} to="/" onClick={handleLogout}>Wyloguj się</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminHeader;
