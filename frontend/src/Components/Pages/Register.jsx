import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const { register, currentUser, registrationMessage, setRegistrationMessage } = useContext(AuthContext);  
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser) {
            setRegistrationMessage(null);
            navigate('/');  
        }
    }, [currentUser, navigate, setRegistrationMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }

        setError(null);
        const newUser = { email, password, firstName, lastName, phoneNumber, address };
        register(newUser);
    };

    return (
        <div className="register-container">
            <hr className="divider" />
            <h2>Rejestracja</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {/* Pola formularza */}
                    <div className="form-group">
                        <label htmlFor="firstName">Imię:</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Nazwisko:</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Numer telefonu:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Adres zamieszkania:</label>
                        <input
                            type="text"
                            id="address"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
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
                    <button type="submit" className="btn btn-primary">Zarejestruj się</button>
                </form>

                {error && <div className="error-message">{error}</div>}
                {registrationMessage && !currentUser && <div className="error-message">{registrationMessage}</div>}
            </div>
            <hr className="divider" />
        </div>
    );
};

export default Register;
