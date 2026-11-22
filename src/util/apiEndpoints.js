//export const BASE_URL = "https://fintrack-rus7.onrender.com/api/v1.0";
//export const BASE_URL = "http://localhost:8080/api/v1.0";
export const BASE_URL = "http://192.168.0.101:8080/api/v1.0";
const CLOUDINARY_CLOUD_NAME = "dzz52jay7";

export const API_ENDPOINTS = {
    LOGIN: "login",
    REGISTER: "register",
    GET_USER_INFO: "/profile",
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
    UPLOAD_IMAGE : `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}