import axios from "axios";
import {BASE_URL} from "./apiEndpoints.js";

// sessionStorage flag that lets the login page explain why the user was signed out
export const SESSION_EXPIRED_KEY = "fintrack:session-expired";

// Pages that can be viewed without a session
const PUBLIC_PATHS = ["/", "/login", "/signup"];

// Endpoints that must never carry an Authorization header
const AUTH_ENDPOINTS = ["login", "register", "status", "activate", "health"];

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Auth endpoints and third-party (absolute) URLs never receive the token.
// Paths are compared without the leading slash so "login" and "/login" match.
const shouldSkipAuth = (url = "") => {
    if (/^https?:\/\//i.test(url)) return true;

    const path = url.replace(/^\/+/, "");
    return AUTH_ENDPOINTS.some((endpoint) => path.startsWith(endpoint));
};

// Drops the dead session and sends the user to the login page
const handleSessionExpired = () => {
    if (localStorage.getItem("token")) {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
    }
    localStorage.removeItem("token");

    if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        window.location.assign("/login");
    }
};

// Request interceptor: attach the JWT
axiosConfig.interceptors.request.use(
    (config) => {
        if (!shouldSkipAuth(config.url)) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: a 401 on a protected endpoint means the session is over.
// A 401 from /login itself is just a wrong password and is left for the form to show.
axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401 && !shouldSkipAuth(error.config?.url)) {
            handleSessionExpired();
        } else if (status >= 500) {
            console.error("Server error. Please try again later.");
        }

        return Promise.reject(error);
    }
);

export default axiosConfig;