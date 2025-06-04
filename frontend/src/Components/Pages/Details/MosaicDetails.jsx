import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import LogIn from '../LogIn';
import './Details.css';

const MosaicDetails = () => {
    const { currentUser, addToCart, mosaics } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const mosaicFromState = location.state?.mosaic;
    const [mosaic, setMosaic] = useState(mosaicFromState);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (!mosaicFromState && mosaics.length > 0) {
            const found = mosaics.find(m => m.id.toString() === id);
            setMosaic(found);
        }
    }, [id, mosaics, mosaicFromState]);

    if (!mosaic) {
        return <p>Nie znaleziono mozaiki. Proszę wrócić do listy.</p>;
    }

    const handleAddToCart = () => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        addToCart({
            id: mosaic.id,
            title: mosaic.name,
            price: mosaic.price,
            size: mosaic.size,
            image: mosaic.imageLink,
            type: 'mosaic'
        });

        setStatus('Dodano do koszyka!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="mosaic-details">
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Logowanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LogIn handleClose={() => setShowLoginModal(false)}/>
                </Modal.Body>
            </Modal>

            <div className="mosaic-content">
                <img src={mosaic.imageLink} alt={mosaic.name} className="mosaic-main-image"/>
                <div className="mosaic-info">
                    <h2>{mosaic.name}</h2>
                    <p><strong>Rozmiar:</strong> {mosaic.size}</p>
                    <p><strong>Cena:</strong> {mosaic.price} PLN</p>
                    <p><strong>Opis:</strong> {mosaic.description}</p>
                </div>
            </div>

            <button type="button" onClick={handleAddToCart} className="add-to-cart-button">
                Dodaj do koszyka
            </button>

            {status && <p className="status-message">{status}</p>}
        </div>
    );
};

export default MosaicDetails;
