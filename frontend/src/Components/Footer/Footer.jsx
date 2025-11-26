import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <div className="contact-info">
            <div className="column">
                <h2>Our support team</h2>
                <p>Phone: +48 792 632 632</p>
                <p>Email: mosaicapl@gmail.com</p>
            </div>
            <div className="separator"></div>

            <div className="column">
                <h2>Warsaw Office</h2>
                <p>36A Krakowska Street</p>
            </div>
        </div>
    );
};

export default Footer;
