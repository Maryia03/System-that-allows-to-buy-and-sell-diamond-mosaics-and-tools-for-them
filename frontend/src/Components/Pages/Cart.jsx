import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Cart.css';

const Cart = () => {
    const { cart, deleteFromCart, currentUser } = useContext(AuthContext);

    if (!currentUser) {
        return (
            <div className="cart-container" style={{ marginTop: '80px' }}>
                <h2>Musisz być zalogowany, aby korzystać z koszyka.</h2>
            </div>
        );
    }


    const handleRemove = (itemId) => {
        deleteFromCart(itemId);
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-container" style={{ marginTop: '80px' }}>
                <h2>Twój koszyk jest pusty</h2>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!currentUser) return;

        const mosaicIds = cart.filter(item => item.type === 'mosaic').map(item => item.id);
        const toolIds = cart.filter(item => item.type === 'tool').map(item => item.id);

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${Cookies.get("user_key")}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            const params = new URLSearchParams();
            params.append('userId', currentUser.id);
            mosaicIds.forEach(id => params.append('mosaicIds', id));
            toolIds.forEach(id => params.append('toolIds', id));

            const response = await axios.post('http://localhost:8080/orders/addOrder', params, config);
            alert(response.data);

            // Очистка корзины
            cart.forEach(item => deleteFromCart(item.id));

        } catch (err) {
            console.error('Błąd podczas składania zamówienia:', err);
            alert('Nie udało się złożyć zamówienia.');
        }
    };

    return (
        <div className="cart-container" style={{ marginTop: '80px' }}>
            <div className="cart-header">
                <h2>Mój Koszyk</h2>
                <p>Przeglądaj produkty dodane do koszyka.</p>
                <hr className="divider" />
            </div>

            {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                    <div className="cart-item-details">
                        <h3>{item.title}</h3>
                        <img
                            src={item.image}
                            alt={item.title}
                            className="cart-item-image"
                        />
                        <p><strong>Rozmiar:</strong> {item.size}</p>
                        <p><strong>Cena:</strong> {item.price} PLN</p>

                        <Button
                            onClick={() => handleRemove(item.id)}
                            className="btn btn-danger"
                        >
                            Usuń z koszyka
                        </Button>
                    </div>
                </div>
            ))}

            <div className="cart-summary">
                <h4>Łączna kwota: {cart.reduce((sum, item) => sum + item.price, 0)} PLN</h4>
                <Button className="btn btn-success" onClick={handleCheckout}>
                    Przejdź do płatności
                </Button>
            </div>
        </div>
    );
};

export default Cart;
