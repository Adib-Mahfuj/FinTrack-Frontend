import {useState} from "react";
import {Link} from "react-router-dom";
import {MailCheck} from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import Input from "../components/input.jsx";
import Button from "../components/Button.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getErrorMessage} from "../util/errorMessage.js";
import {validateEmail} from "../util/validation.js";
import {canAutoFocus} from "../util/device.js";

const BackToLogin = (
    <>
        Remembered your password?{" "}
        <Link to="/login" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
            Log in
        </Link>
    </>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    // Holds the address the link was requested for; shows the confirmation screen when set
    const [sentTo, setSentTo] = useState("");

    const handleChange = (value) => {
        setEmail(value);
        setFieldError("");
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const trimmed = email.trim();
        if (!validateEmail(trimmed)) {
            setFieldError("Enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await axiosConfig.post(API_ENDPOINTS.FORGOT_PASSWORD, {email: trimmed});
            setSentTo(trimmed);
        } catch (error) {
            console.error("Password reset request failed", error);
            setFormError(getErrorMessage(error, "Something went wrong. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    // The same message is shown for every address, so it never reveals which emails have accounts
    if (sentTo) {
        return (
            <AuthLayout pageTitle="Check your email" title="Check your email" footer={BackToLogin}>
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MailCheck size={24}/>
                </div>
                <p className="text-center text-sm leading-relaxed text-gray-600">
                    If an account exists for <span className="font-medium text-gray-900">{sentTo}</span>, we sent a
                    link to reset your password. It expires in 1 hour.
                </p>
                <p className="mt-3 text-center text-xs text-gray-500">Can&apos;t find it? Check your spam folder.</p>

                <Button variant="secondary" size="lg" className="mt-6 w-full" onClick={() => setSentTo("")}>
                    Use a different email
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            pageTitle="Forgot password"
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a link to reset it."
            footer={BackToLogin}
        >
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    value={email}
                    onChange={({target}) => handleChange(target.value)}
                    label="Email address"
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    autoFocus={canAutoFocus()}
                    error={fieldError}
                />

                {formError && (
                    <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" loading={loading} loadingText="Sending link...">
                    Send reset link
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;