import React from "react";
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import "./signUp.scss";

function SignUp() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();
    let navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch("http://49.13.31.246:9191/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Erfolgreiche Registrierung", result);
                localStorage.setItem("token", result.token);
                navigate(`/signIn`);
            } else {
                console.error("Fehler bei Registrierung", result);
            }
        } catch (error) {
            console.error("Anforderungsfehler", error);
        }
    };

    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="signup-header">Registrierung</h2>
                <label className="signup-label">
                    <span className="signup-label-text">Benutzername</span>
                    <input
                        className="signup-input"
                        name="username"
                        {...register("username", {required: true, minLength: 4})}
                    />
                    {errors.username && (
                        <p className="signup-error">Benutzername ist Pflichtfeld</p>
                    )}
                </label>
                <label className="signup-label">
                    <span className="signup-label-text">Password</span>
                    <input
                        type="password"
                        className="signup-input"
                        name="password"
                        {...register("password", {required: true, minLength: 4})}
                    />
                    {errors.password && (
                        <p className="signup-error">Password ist Pflichtfeld</p>
                    )}
                </label>
                <label className="signup-label">
                    <span className="signup-label-text">Password wiederholen</span>
                    <input
                        type="password"
                        className="signup-input"
                        name="confirm_password"
                        {...register("confirm_password", {required: true, minLength: 4})}
                    />
                    {errors.confirm_password && (
                        <p className="signup-error">Password ist Pflichtfeld</p>
                    )}
                </label>
                <button type="submit" className="signup-button">
                    Registrieren
                </button>

                <p className="text-signup">Sie haben bereits Acount? <Link to="/signin"
                                                                            className="signin-switch-link">Zu Login</Link>
                </p>


                <p className="signup-footer">© {new Date().getFullYear()}. All rights reserved</p>
            </form>
        </div>
    );
}

export default SignUp;