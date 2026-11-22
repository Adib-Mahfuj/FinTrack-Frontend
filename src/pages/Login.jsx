import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout.jsx";
import Input from "../components/input.jsx";
import Button from "../components/Button.jsx";
import {AppContext} from "../context/AppContext.jsx";
import axiosConfig, {SESSION_EXPIRED_KEY} from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getErrorMessage} from "../util/errorMessage.js";
import {validateEmail} from "../util/validation.js";
import {canAutoFocus} from "../util/device.js";

const Login = () => {
    const navigate = useNavigate();
    const {setUser} = useContext(AppContext);

    const [form, setForm] = useState({email: "", password: ""});
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    // Explain why the user was sent back here after an expired session
    useEffect(() => {
        if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
            sessionStorage.removeItem(SESSION_EXPIRED_KEY);
            toast("Your session has expired. Please log in again.", {id: "session-expired"});
        }
    }, []);

    const handleChange = (key, value) => {
        setForm((prev) => ({...prev, [key]: value}));
        setFieldErrors((prev) => ({...prev, [key]: undefined}));
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const email = form.email.trim();
        const errors = {};
        if (!validateEmail(email)) errors.email = "Enter a valid email address";
        if (!form.password) errors.password = "Enter your password";

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {email, password: form.password});
            const {token, user} = response.data;

            if (!token) throw new Error("Login failed. Please try again.");

            localStorage.setItem("token", token);
            setUser(user);
            navigate("/dashboard", {replace: true});
        } catch (error) {
            console.error("Login failed", error);
            setFormError(getErrorMessage(error, "Login failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            pageTitle="Log in"
            title="Welcome back"
            subtitle="Log in to continue tracking your finances."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
                        Sign up
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    value={form.email}
                    onChange={({target}) => handleChange("email", target.value)}
                    label="Email address"
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoFocus={canAutoFocus()}
                    error={fieldErrors.email}
                />

                <Input
                    value={form.password}
                    onChange={({target}) => handleChange("password", target.value)}
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    error={fieldErrors.password}
                />

                {formError && (
                    <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" loading={loading} loadingText="Logging in...">
                    Log in
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;