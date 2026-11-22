// Turns any thrown error into a message that is safe to show to the user
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    // A request without a response means the server could not be reached at all
    if (error?.request && !error?.response) {
        const message = "Unable to reach the server. Check your connection and try again.";

        // Development only: reveal which API address was attempted
        return import.meta.env.DEV && error.config?.baseURL
            ? `${message} (API: ${error.config.baseURL})`
            : message;
    }

    const data = error?.response?.data;
    if (data?.message || data?.error) return data.message || data.error;

    // Plain errors thrown by our own code carry a ready-made message
    if (error?.message && !error?.isAxiosError) return error.message;

    return fallback;
};