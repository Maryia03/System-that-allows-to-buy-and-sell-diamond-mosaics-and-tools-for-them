import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './AdminOrders.css';

const AdminOrders= () => {
    const [orders, setOrders] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };
        axios.get(`http://localhost:8080/orders/all`, config)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    };

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
    };

    const updateStatus = (orderId) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus) return;

        axios.patch(`http://localhost:8080/orders/updateStatus/${orderId}`, null, {
            params: { newStatus },
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        })
            .then(() => {
                alert(`Status zamówienia ${orderId} zmieniony na ${newStatus}`);
                fetchOrders(); // reload orders
            })
            .catch(err => {
                console.error(err);
                alert('Nie udało się zmienić statusu');
            });
    };

    return (
        <div className="orders-page" style={{ marginTop: '80px' }}>
            <h2>Wszystkie Zamówienia</h2>
            <hr />
            {orders.length === 0 ? (
                <p>Brak zamówień.</p>
            ) : (
                orders.map(order => (
                    <div className="order-card" key={order.id}>
                        <h4>Użytkownik: {order.user?.name || 'Nieznany'} (ID: {order.user?.id || 'Brak ID'})</h4>
                        <p>Status: {order.orderStatus}</p>
                        <p>Łączny koszt: {order.totalCost} PLN</p>

                        <div>
                            <h5>Mosaics:</h5>
                            {order.mosaics?.map(mosaic => (
                                <p key={`mosaic-${mosaic.id}`}>{mosaic.title} - {mosaic.price} PLN</p>
                            )) || <p>No mosaics</p>}
                        </div>

                        <div>
                            <h5>Tools:</h5>
                            {order.tools?.map(tool => (
                                <p key={`tool-${tool.id}`}>{tool.name} - {tool.price} PLN</p>
                            )) || <p>No tools</p>}
                        </div>

                        {/* Select + Button only if status can be changed */}
                        <div className="admin-status-control">
                            <label htmlFor={`status-${order.id}`}>Zmień status:</label>
                            <select
                                id={`status-${order.id}`}
                                value={statusUpdates[order.id] || ''}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                                <option value="">-- select --</option>
                                {order.orderStatus === 'PAID' && <option value="PENDING">PENDING</option>}
                                {order.orderStatus === 'PENDING' && <option value="DELIVERED">DELIVERED</option>}
                            </select>
                            <button
                                onClick={() => updateStatus(order.id)}
                                disabled={!statusUpdates[order.id]}
                                className="btn btn-primary"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminOrders;
