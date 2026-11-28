import {useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout.jsx";
import Input from "../components/input.jsx";
import Button from "../components/Button.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getErrorMessage} from "../util/errorMessage.js";
import {canAutoFocus} from "../util/device.js";

const MIN_PASSWORD_LENGTH = 8;

// Returns an { field: message } map for the reset form
const validate = ({password, confirmPassword}) => {
    const errors = {};

    if (!password) errors.password = "Enter a new password";
    else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (!confirmPassword) errors.confirmPassword = "Confirm your new password";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    return errors;
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({password: "", confirmPassword: ""});
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setForm((prev) => ({...prev, [key]: value}));
        setFieldErrors((prev) => ({...prev, [key]: undefined}));
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const errors = validate(form);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        try {
            await axiosConfig.post(API_ENDPOINTS.RESET_PASSWORD, {token, newPassword: form.password});
            toast.success("Password updated. Log in with your new password.");
            navigate("/login", {replace: true});
        } catch (error) {
            console.error("Password reset failed", error);
            setFormError(getErrorMessage(error, "Could not reset your password. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    // Opened without a token (for example a copied link that lost its query string)
    if (!token) {
        return (
            <AuthLayout
                pageTitle="Invalid link"
                title="Invalid reset link"
                subtitle="This link is incomplete or has already been used."
            >
                <Button as={Link} to="/forgot-password" size="lg" className="w-full">
                    Request a new link
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            pageTitle="Reset password"
            title="Set a new password"
            subtitle="Choose a new password for your account."
            footer={
                <>
                    Link expired?{" "}
                    <Link to="/forgot-password" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
                        Request a new one
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    value={form.password}
                    onChange={({target}) => handleChange("password", target.value)}
                    label="New password"
                    placeholder="Create a new password"
                    type="password"
                    autoComplete="new-password"
                    autoFocus={canAutoFocus()}
                    helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    error={fieldErrors.password}
                />

                <Input
                    value={form.confirmPassword}
                    onChange={({target}) => handleChange("confirmPassword", target.value)}
                    label="Confirm new password"
                    placeholder="Re-enter the new password"
                    type="password"
                    autoComplete="new-password"
                    error={fieldErrors.confirmPassword}
                />

                {formError && (
                    <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" loading={loading} loadingText="Updating password...">
                    Reset password
                </Button>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;