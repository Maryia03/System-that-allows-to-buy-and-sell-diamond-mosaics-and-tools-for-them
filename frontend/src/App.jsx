import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header/Header';
import AdminHeader from './Components/Header/AdminHeader'; // Nagłówek dla administratora
import Footer from './Components/Footer/Footer';
import LogIn from './Components/Pages/LogIn';
import Register from './Components/Pages/Register';
import AdminPage from './Components/Pages/Admin/AdminPage';
import MosaicDetails from './Components/Pages/Details/MosaicDetails';
import AdminUsers from './Components/Pages/Admin/AdminUsers';
import AdminMosaics from './Components/Pages/Admin/AdminMosaics';
import AdminTools from './Components/Pages/Admin/AdminTools';
import AdminOrders from './Components/Pages/Admin/AdminOrders';
import { AuthContext } from './Context/AuthContext';
import Cookies from 'js-cookie'
import MosaicList from "./Components/Pages/MosaicList";
import ToolList from "./Components/Pages/ToolList";
import Cart from "./Components/Pages/Cart";
import ToolDetails from "./Components/Pages/Details/ToolDetails";
import Orders from './Components/Pages/Orders';

const AppContent = () => {
    const { logout } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [mosaicsData, setMosaicsData] = useState([]);
    const [toolsData, setToolsData] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedMosaics = JSON.parse(localStorage.getItem('mosaics')) || [];
        setMosaicsData(savedMosaics);
        if(Cookies.get("admin") === '1'){
            setCurrentUser({role: 'admin'});
        }
    }, []);

    useEffect(() => {
        const ignorePaths = ['/login', '/register'];
        if (!ignorePaths.includes(location.pathname)) {
            localStorage.setItem('lastVisitedPath', location.pathname);
        }
    }, [location]);

    useEffect(() => {
        const savedPath = localStorage.getItem('lastVisitedPath');
        const currentPath = window.location.pathname;
        if (
            savedPath &&
            savedPath !== currentPath &&
            !['/login', '/register'].includes(savedPath)
        ) {
            navigate(savedPath, { replace: true });
        }
    }, []);

    return (
        <div className="App">
            {Cookies.get('admin') === "1" ? (
                <AdminHeader />
            ) : (
                <Header currentUser={Cookies.get('user_id')} logout={logout} />
            )}

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            Cookies.get('admin') === '1'
                                ? <Navigate to="/admin/mosaics" replace />
                                : <MosaicList mosaics={mosaicsData} />
                        }
                    />
                    <Route path="/login" element={Cookies.get('user_id') ? <Navigate to="/" /> : <LogIn />} />
                    <Route path="/register" element={Cookies.get('user_id') ? <Navigate to="/" /> : <Register />} />
                    <Route path="/mosaics/:id" element={<MosaicDetails />} />
                    <Route path="/tools/:id" element={<ToolDetails />} />
                    <Route path="/mosaics" element={<MosaicList mosaics={mosaicsData} />} />
                    <Route path="/tool" element={<ToolList tools={toolsData} />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/cart" element={<Cart />} />

                    <Route
                        path="/admin"
                        element={currentUser?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/users"
                        element={currentUser?.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/mosaics"
                        element={currentUser?.role === 'admin' ? <AdminMosaics mosaicsData={mosaicsData} setMosaicsData={setMosaicsData} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/tools"
                        element={currentUser?.role === 'admin' ? <AdminTools /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/orders"
                        element={currentUser?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />}
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};


const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
