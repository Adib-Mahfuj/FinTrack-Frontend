import {useState} from "react";
import {Link} from "react-router-dom";
import {MailCheck} from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import Input from "../components/input.jsx";
import Button from "../components/Button.jsx";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getErrorMessage} from "../util/errorMessage.js";
import {validateEmail} from "../util/validation.js";
import {canAutoFocus} from "../util/device.js";
import uploadProfileImage from "../util/uploadProfileImage.js";

const MIN_PASSWORD_LENGTH = 8;

// Returns an { field: message } map for the signup form
const validate = ({fullName, email, password}) => {
    const errors = {};

    if (!fullName.trim()) errors.fullName = "Enter your full name";
    if (!validateEmail(email.trim())) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Enter a password";
    else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    return errors;
};

const Signup = () => {
    const [form, setForm] = useState({fullName: "", email: "", password: ""});
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

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
            // The photo is optional; upload it first so its URL can be stored with the profile
            const profileImageUrl = profilePhoto ? (await uploadProfileImage(profilePhoto)) || "" : "";

            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password,
                profileImageUrl,
            });

            if (response.status === 201) {
                setRegisteredEmail(form.email.trim());
            }
        } catch (error) {
            console.error("Registration failed", error);
            setFormError(getErrorMessage(error, "Registration failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    // The account must be activated through the emailed link before the first login
    if (registeredEmail) {
        return (
            <AuthLayout pageTitle="Check your email" title="Check your email">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MailCheck size={24}/>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                    We sent an activation link to{" "}
                    <span className="font-medium text-gray-900">{registeredEmail}</span>. Open it to activate your
                    account, then log in.
                </p>
                <p className="mt-3 text-xs text-gray-500">Can&apos;t find it? Check your spam folder.</p>

                <Button as={Link} to="/login" size="lg" className="mt-6 w-full">
                    Go to login
                </Button>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            pageTitle="Sign up"
            title="Create your account"
            subtitle="Start tracking your income and expenses today."
            footer={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                    <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto}/>
                </div>

                <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                    <Input
                        value={form.fullName}
                        onChange={({target}) => handleChange("fullName", target.value)}
                        label="Full name"
                        placeholder="John Doe"
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        autoFocus={canAutoFocus()}
                        error={fieldErrors.fullName}
                    />

                    <Input
                        value={form.email}
                        onChange={({target}) => handleChange("email", target.value)}
                        label="Email address"
                        placeholder="name@example.com"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        error={fieldErrors.email}
                    />
                </div>

                <Input
                    value={form.password}
                    onChange={({target}) => handleChange("password", target.value)}
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    autoComplete="new-password"
                    helperText={`At least ${MIN_PASSWORD_LENGTH} characters`}
                    error={fieldErrors.password}
                />

                {formError && (
                    <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {formError}
                    </p>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" loading={loading} loadingText="Creating account...">
                    Create account
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Signup;