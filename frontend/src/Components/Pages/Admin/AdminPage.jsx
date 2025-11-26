import React from 'react';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminMosaics from './AdminMosaics';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminTools from "./AdminTools";

const AdminPage = () => {
    return (
        <div>
            <h1>Administrator Panel</h1>
            <Routes>
                <Route path="/" element={<AdminMosaics />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="mosaics" element={<AdminMosaics />} />
                <Route path="tools" element={<AdminTools />} />
            </Routes>
        </div>
    );
};

export default AdminPage;
