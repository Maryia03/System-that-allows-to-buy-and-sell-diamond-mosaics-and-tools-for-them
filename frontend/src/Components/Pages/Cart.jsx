import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Cart.css';
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cart, deleteFromCart, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!currentUser) {
        return <h2 style={{ marginTop: '80px' }}>You must be logged in to view your orders.</h2>;
    }

    const handleRemove = (itemId) => {
        deleteFromCart(itemId);
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="cart-container" style={{ marginTop: '80px' }}>
                <h2>Your cart is empty</h2>
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

            cart.forEach(item => deleteFromCart(item.id));

        } catch (err) {
            console.error('Error while placing an order:', err);
            alert('The order could not be placed.');
        }
    };

    return (
        <div className="cart-container" style={{ marginTop: '80px' }}>
            <div className="cart-header">
                <h2>My Cart</h2>
                <p>View the items you have added to your cart.</p>
                <hr className="divider" />
            </div>

            {cart.map((item) => (
                <div
                    key={item.id}
                    className="cart-item-card clickable"
                    onClick={() =>
                        navigate(
                            item.type === 'mosaic'
                                ? `/mosaics/${item.id}`
                                : `/tools/${item.id}`,
                            { state: { item } }
                        )
                    }
                >
                    <div className="cart-item-details">
                        <h3>{item.title}</h3>
                        <img
                            src={item.image}
                            alt={item.title}
                            className="cart-item-image"
                        />
                        {item.size && <p><strong>Size:</strong> {item.size}</p>}
                        <p><strong>Price:</strong> {item.price} PLN</p>

                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(item.id);
                            }}
                            className="btn btn-danger"
                        >
                            Remove from cart
                        </Button>
                    </div>
                </div>
            ))}

            <div className="cart-summary">
                <h4>Total amount: {cart.reduce((sum, item) => sum + item.price, 0)} PLN</h4>
                <Button className="btn btn-success" onClick={handleCheckout}>
                    Proceed to payment
                </Button>
            </div>
        </div>
    );
};

export default Cart;