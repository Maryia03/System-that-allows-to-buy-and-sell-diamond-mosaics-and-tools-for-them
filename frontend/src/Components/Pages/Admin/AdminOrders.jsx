import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './AdminOrders.css';

const AdminOrders = () => {
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
                fetchOrders();
            })
            .catch(err => {
                console.error(err);
                alert('Nie udało się zmienić statusu');
            });
    };

    return (
        <div className="orders-page" style={{ marginTop: '80px' }}>
            <h2>All Orders</h2>
            <hr />

            {orders.length === 0 ? (
                <p>No orders</p>
            ) : (
                orders.map(order => (
                    <div className="order-card" key={order.id}>
                        <h4>User: {order.user?.name || 'Unknown'} (ID: {order.user?.id || 'No ID'})</h4>
                        <p>Status: {order.orderStatus}</p>
                        <p>Total cost: {order.totalCost} PLN</p>

                        {/* Mosaics only if exist */}
                        {order.mosaics && order.mosaics.length > 0 && (
                            <div>
                                <h5>Mosaics:</h5>
                                {order.mosaics.map(mosaic => (
                                    <p key={`mosaic-${mosaic.id}`}>
                                        {mosaic.name} (ID: {mosaic.id}) – {mosaic.price} PLN
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Tools only if exist */}
                        {order.tools && order.tools.length > 0 && (
                            <div>
                                <h5>Tools:</h5>
                                {order.tools.map(tool => (
                                    <p key={`tool-${tool.id}`}>
                                        {tool.name} (ID: {tool.id}) – {tool.price} PLN
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Change order status */}
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
