/**
 * Returns the current date in the user's local timezone as YYYY-MM-DD.
 * Avoids Date#toISOString(), which uses UTC and can be a day behind.
 */
export const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};