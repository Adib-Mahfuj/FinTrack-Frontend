// Production API (used when no environment override is provided)
const PRODUCTION_BASE_URL = "https://fintrack-rus7.onrender.com/api/v1.0";

// Resolution order:
// 1. VITE_API_BASE_URL (explicit override, e.g. in .env.local or on the hosting platform)
// 2. Development: the host the app was opened from, so localhost, LAN and phone testing all work
// 3. Production build: the deployed API
export const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? `http://${window.location.hostname}:8080/api/v1.0` : PRODUCTION_BASE_URL);

const CLOUDINARY_CLOUD_NAME = "dzz52jay7";

export const API_ENDPOINTS = {
    LOGIN: "login",
    REGISTER: "register",
    GET_USER_INFO: "/profile",
    UPDATE_PROFILE: "/profile",
    CHANGE_PASSWORD: "/profile/password",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_INCOMES: "/incomes",
    GET_ALL_EXPENSES: "/expenses",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_INCOME: "/incomes",
    ADD_EXPENSE: "/expenses",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    INCOME_EXCEL_DOWNLOAD: "excel/download/income",
    EXPENSE_EXCEL_DOWNLOAD: "excel/download/expense",
    EMAIL_INCOME: "/email/income-excel",
    EMAIL_EXPENSE: "/email/expense-excel",
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}