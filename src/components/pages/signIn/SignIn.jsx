import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../../features/features";
import "./signIn.scss";

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [serverError, setServerError] = useState("");

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await fetch("http://49.13.31.246:9191/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("token", result.token);
                dispatch(setToken({ token: result.token }));
                navigate("/feed");
            } else {
                setServerError(result.message || "Falsche Zugangsdaten");
            }
        } catch (error) {
            console.error("⚠️ Verbindungsfehler:", error);
            setServerError("Serverfehler – bitte später erneut versuchen");
        }
    };
    return (
        <div className="signin-page">
            <form className="signin-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <h2 className="signin-header">Login</h2>

                <label className="signin-label">
                    <span className="signin-label-text">Benutzername</span>
                    <input
                        type='text'
                        className="signin-input"
                        {...register("username", {required: "Geben Sie Ihren Benutzernamen ein", minLength: 3})}
                    />
                    {errors.username && <p className="signin-error">{errors.username.message}</p>}
                </label>

                <label className="signin-label">
                    <span className="signin-label-text">Passwort</span>
                    <input
                        type="password"
                        className="signin-input"
                        {...register("password", {required: "Geben Sie Ihr Passwort ein", minLength: 3})}
                    />
                    {errors.password && <p className="signin-error">{errors.password.message}</p>}
                </label>

                <button type="submit" className="signin-button">
                    Login
                </button>
                <p className="text-signin">Haben Sie noch kein Konto? <Link to="/signup" className="signin-switch-link">Registrieren</Link></p>
                {serverError && <p className="signin-error server-error">{serverError}</p>}

                <p className="signup-footer">© 2025. Alle Rechte vorbehalten</p>
            </form>
        </div>
    );
}

export default SignIn;