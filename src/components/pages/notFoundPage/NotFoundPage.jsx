import { useNavigate } from "react-router-dom";
import "./notFoundPage.scss";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-box">
                <h1 className="not-found-title">404 - Seite nicht gefunden</h1>
                <p className="not-found-text">Die Seite, die du suchst, existiert nicht oder wurde verschoben.</p>
                <button className="not-found-button" onClick={() => navigate("/signin")}>
                    Startseite
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
