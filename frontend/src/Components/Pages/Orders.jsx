import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Orders.css';

const Orders= () => {
    const [orders, setOrders] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        console.log("Current user:", currentUser);
        if (!currentUser) return;

        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };

        axios.get(`http://localhost:8080/orders/user/${currentUser.id}`, config)
            .then((res) => setOrders(res.data))
            .catch(err => console.error(err));
    }, [currentUser]);

    if (!currentUser) {
        return <h2 style={{ marginTop: '80px' }}>Musisz być zalogowany, aby zobaczyć zamówienia.</h2>;
    }

    return (
        <div className="orders-page" style={{ marginTop: '80px' }}>
            <h2>Moje Zamówienia</h2>
            <hr />
            {orders.length === 0 ? (
                <p>Brak zamówień.</p>
            ) : (
                orders.map(order => (
                    <div className="order-card" key={order.id}>
                        <h4>Status: {order.orderStatus}</h4>
                        <p>Łączny koszt: {order.totalCost} PLN</p>

                        <div>
                            <h5>Mosaics:</h5>
                            {Array.isArray(order.mosaics) && order.mosaics.length > 0 ? (
                                order.mosaics.map(mosaic => (
                                    <div key={mosaic.id}>
                                        <p>{mosaic.title} - {mosaic.price} PLN</p>
                                    </div>
                                ))
                            ) : <p>Brak mozaik.</p>}
                        </div>

                        <div>
                            <h5>Tools:</h5>
                            {Array.isArray(order.tools) && order.tools.length > 0 ? (
                                order.tools.map(tool => (
                                    <div key={tool.id}>
                                        <p>{tool.name} - {tool.price} PLN</p>
                                    </div>
                                ))
                            ) : <p>Brak narzędzi.</p>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
