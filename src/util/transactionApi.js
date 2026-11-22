import moment from "moment";
import axiosConfig from "./axiosConfig.jsx";
import {API_ENDPOINTS} from "./apiEndpoints.js";
import {DATE_FORMAT} from "./summary.js";

// Start and end (YYYY-MM-DD) of the month that contains the given moment
export const getMonthRange = (month = moment()) => [
    month.clone().startOf("month").format(DATE_FORMAT),
    month.clone().endOf("month").format(DATE_FORMAT),
];

// Fetches transactions of one type for a date range through the filter endpoint
export const fetchTransactionsInRange = async (type, startDate, endDate, signal) => {
    const response = await axiosConfig.post(
        API_ENDPOINTS.APPLY_FILTERS,
        {type, startDate, endDate, keyword: "", sortField: "date", sortOrder: "desc"},
        {signal}
    );
    return Array.isArray(response.data) ? response.data : [];
};