import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Orders.css';
import { useNavigate } from "react-router-dom";


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };

        axios.get(`http://localhost:8080/orders/user/${currentUser.id}`, config)
            .then((res) => setOrders(res.data))
            .catch(err => console.error(err));
    }, [currentUser]);

    if (!currentUser) {
        return <h2 style={{ marginTop: '80px' }}>You must be logged in to view your orders.</h2>;
    }

    return (
        <div className="orders-page" style={{ marginTop: '80px' }}>
            <h2>My Orders</h2>
            <hr />
            {orders.length === 0 ? (
                <p>No orders</p>
            ) : (
                orders.map(order => (
                    <div className="order-card" key={order.id}>
                        <h4>Status: {order.orderStatus}</h4>
                        <p>Total cost: {order.totalCost} PLN</p>

                        {order.mosaics && order.mosaics.length > 0 && (
                            <div className="order-section">
                                <h5>Mosaics:</h5>
                                <div className="order-items-grid">
                                    {order.mosaics.map(mosaic => (
                                        <div className="order-item clickable" key={mosaic.id}
                                             onClick={() => navigate(`/mosaics/${mosaic.id}`, { state: { mosaic } })}
                                        >
                                            <img src={mosaic.imageLink} alt={mosaic.name} className="order-thumb"/>
                                            <div>
                                                <p><strong>{mosaic.name}</strong></p>
                                                <p>{mosaic.price} PLN</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {order.tools && order.tools.length > 0 && (
                            <div className="order-section">
                                <h5>Tools:</h5>
                                <div className="order-items-grid">
                                    {order.tools.map(tool => (
                                        <div className="order-item clickable" key={tool.id}
                                             onClick={() => navigate(`/tools/${tool.id}`, { state: { tool } })}
                                        >
                                            <img src={tool.imageLink} alt={tool.name} className="order-thumb"/>
                                            <div>
                                                <p><strong>{tool.name}</strong></p>
                                                <p>{tool.price} PLN</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
