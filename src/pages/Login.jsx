import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assests.js";
import Input from "../components/input.jsx";
import {validateEmail} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {AppContext} from "../context/AppContext.jsx";
import {LoaderCircle} from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AppContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setError("");

        // Basic validation
        if (!validateEmail(email)) {
            setError("Please enter valid email address");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            return;
        }

        setIsLoading(true);

        // LOGIN API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });

            const {token, user} = response.data;

            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                toast.success("Login successful!");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error('Something went wrong', err);

            // error handling
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || err.message
                || "Login failed. Please try again.";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image with blur*/}
            <img
                src={assets.login_bg}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm"
            />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Welcome Back
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Please enter your details to login.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="name@example.com"
                            type="text"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="********"
                            type="password"
                        />

                        {error && (
                            <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isLoading}
                            className={`w-full py-3 text-lg font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-60 cursor-not-allowed': ''}`}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5"/>
                                    Logging in...
                                </>
                            ) : (
                                "LOGIN"
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-gray-900 underline hover:text-gray-700 transition-colors"
                            >
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;