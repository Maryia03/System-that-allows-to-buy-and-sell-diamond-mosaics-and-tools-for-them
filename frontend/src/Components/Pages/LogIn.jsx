import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import Cookies from 'js-cookie'

const LogIn = ({ handleClose }) => {
    const { login, errorMessage } = useContext(AuthContext);
    const [refresh, setRefresh] = useState(true);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (Cookies.get("user_key")) {
            handleClose();
            //Jeśli użytkownik jest administratorem, przekieruj do panelu admina
            if (Cookies.get('admin') == "1") {
                navigate('/admin');  
            } else {
                navigate('/');  // Inaczej przekierowanie na stronę główną
            }
        }
    }, [ navigate, handleClose, refresh]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setRefresh(!refresh)
        login(email, password)
          if (Cookies.get("user_key") != "undefined") {
            handleClose();
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            <hr className="divider" />
            <h2>Logowanie</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Zaloguj się</button>
                </form>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            <hr className="divider" />
        </div>
    );
};

export default LogIn;
