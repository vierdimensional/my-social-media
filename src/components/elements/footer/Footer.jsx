import React from 'react';
import { Link } from "react-router-dom";
import "./footer.css"; // Stelle sicher, dass CSS für die Klassen existiert

const Footer = () => {
    return (
        <div className="footer-container">
            <nav>
                <p className="text-footer">
                    Haben Sie noch kein Konto?
                    <Link to="/signup" className="signin-switch-link"> Registrieren</Link>
                </p>
                <p className="signup-footer">© 2025. Alle Rechte vorbehalten</p>
            </nav>
        </div>
    );
};

export default Footer;
