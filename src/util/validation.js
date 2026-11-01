export const validateEmail = (email) => {
    if (!email.trim()) return false;   // empty check first

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);          // valid format check
}
