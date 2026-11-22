import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import moment from "moment";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {fetchTransactionsInRange, getMonthRange} from "../util/transactionApi.js";

// Falls back to the controller path when the constant is not defined
const DASHBOARD_ENDPOINT = API_ENDPOINTS.DASHBOARD_DATA ?? "/dashboard";

const EMPTY_DATA = {incomes: [], expenses: [], previousIncomes: [], previousExpenses: [], totals: null};

// All-time totals ({ totalBalance, totalIncome, totalExpense }) from the dashboard endpoint
const fetchTotals = async (signal) => {
    const response = await axiosConfig.get(DASHBOARD_ENDPOINT, {signal});
    return response.data ?? null;
};

// Loads the current and previous month for both types, plus the all-time totals
const useDashboardData = () => {
    const [data, setData] = useState(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const hasLoaded = useRef(false);

    useEffect(() => {
        const controller = new AbortController();
        const {signal} = controller;
        const now = moment();
        const [monthStart, monthEnd] = getMonthRange(now);
        const [previousStart, previousEnd] = getMonthRange(now.clone().subtract(1, "month"));

        const load = async () => {
            setError(false);
            // Keep existing data on screen while refreshing; skeletons are for the first load only
            if (!hasLoaded.current) setLoading(true);

            try {
                const [incomes, expenses, previousIncomes, previousExpenses, totals] = await Promise.all([
                    fetchTransactionsInRange("income", monthStart, monthEnd, signal),
                    fetchTransactionsInRange("expense", monthStart, monthEnd, signal),
                    fetchTransactionsInRange("income", previousStart, previousEnd, signal),
                    fetchTransactionsInRange("expense", previousStart, previousEnd, signal),
                    // Totals are optional: a failure here must not break the whole page
                    fetchTotals(signal).catch((err) => {
                        if (axios.isCancel(err)) throw err;
                        return null;
                    }),
                ]);
                setData({incomes, expenses, previousIncomes, previousExpenses, totals});
                hasLoaded.current = true;
            } catch (err) {
                if (axios.isCancel(err)) return; // a newer request replaced this one
                console.error("Failed to load dashboard data", err);
                setError(true);
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        load();

        return () => controller.abort();
    }, [reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return {...data, loading, error, reload};
};

export default useDashboardData;