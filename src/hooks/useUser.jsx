import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";

// Loads the signed-in user into context; sends visitors without a valid session to the login page
export const useUser = () => {
    const {user, setUser, clearUser} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            try {
                const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
                if (isMounted && response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user information", error);
                if (!isMounted) return;

                // A rejected token can never recover, so drop it
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    localStorage.removeItem("token");
                }

                clearUser();
                navigate("/login", {replace: true});
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [user, setUser, clearUser, navigate]);

    return user;
};