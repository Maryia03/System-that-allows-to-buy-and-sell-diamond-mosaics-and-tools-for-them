import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import LogIn from '../LogIn';
import './Details.css';

const ToolDetails = () => {
    const { currentUser, addToCart, tools } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const toolFromState = location.state?.tool;
    const [tool, setTool] = useState(toolFromState);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!toolFromState && tools.length > 0) {
            const found = tools.find(t => t.id.toString() === id);
            setTool(found);
        }
    }, [id, tools, toolFromState]);

    if (!tool) {
        return <p>No tool found. Please return to the list.</p>;
    }

    const handleAddToCart = () => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        addToCart({
            id: tool.id,
            title: tool.name,
            price: tool.price,
            image: tool.imageLink,
            type: 'tool'
        });

        setStatus('Added to cart!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="tool-details">
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LogIn handleClose={() => setShowLoginModal(false)}/>
                </Modal.Body>
            </Modal>

            <div className="tool-content">
                <img src={tool.imageLink} alt={tool.name} className="tool-main-image"/>
                <div className="tool-info">
                    <h2>{tool.name}</h2>
                    <p><strong>Price:</strong> {tool.price} PLN</p>
                    <p><strong>Description:</strong> {tool.description}</p>
                </div>
            </div>
                <button type="button" onClick={handleAddToCart} className="add-to-cart-button">
                    Add to cart
                </button>
                    {status && <p className="status-message">{status}</p>}
            </div>
            );
            };

            export default ToolDetails;
