import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import {fetchTransactionsInRange, getMonthRange} from "../util/transactionApi.js";
import {summarize} from "../util/summary.js";

// Totals of the previous calendar month for one type; powers the "vs last month" trend
const usePreviousMonthSummary = (type) => {
    const [previous, setPrevious] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const [start, end] = getMonthRange(moment().subtract(1, "month"));

        fetchTransactionsInRange(type, start, end, controller.signal)
            .then((transactions) => setPrevious(summarize(transactions)))
            .catch((error) => {
                if (!axios.isCancel(error)) console.error("Failed to load previous month summary", error);
            });

        return () => controller.abort();
    }, [type, reloadKey]);

    const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

    return {previous, refresh};
};

export default usePreviousMonthSummary;