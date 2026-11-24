import {useEffect, useState} from "react";
import axios from "axios";
import {fetchTransactionsInRange, getMonthRange} from "../util/transactionApi.js";

// Builds { [categoryId]: { count, total } } from a list of transactions
const buildActivity = (transactions) =>
    transactions.reduce((result, transaction) => {
        const key = transaction.categoryId;
        if (key === null || key === undefined) return result;

        const entry = result[key] ?? {count: 0, total: 0};
        entry.count += 1;
        entry.total += Number(transaction.amount) || 0;
        result[key] = entry;

        return result;
    }, {});

// This month's usage per category. The stats are optional, so a failed request is only logged.
const useCategoryActivity = () => {
    const [activity, setActivity] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const {signal} = controller;
        const [start, end] = getMonthRange();

        Promise.all([
            fetchTransactionsInRange("income", start, end, signal),
            fetchTransactionsInRange("expense", start, end, signal),
        ])
            .then(([incomes, expenses]) => setActivity(buildActivity([...incomes, ...expenses])))
            .catch((error) => {
                if (!axios.isCancel(error)) console.error("Failed to load category activity", error);
            })
            .finally(() => {
                if (!signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, []);

    return {activity, loading};
};

export default useCategoryActivity;