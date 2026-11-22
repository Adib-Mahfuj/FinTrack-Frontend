import moment from "moment";

export const DATE_FORMAT = "YYYY-MM-DD";

const toNumber = (value) => Number(value) || 0;

// Category name, or an empty string when the backend sends none
export const categoryLabel = (transaction) =>
    transaction.categoryName && transaction.categoryName !== "N/A" ? transaction.categoryName : "";

// Total, count and highest transaction of a list
export const summarize = (transactions = []) => {
    let total = 0;
    let highest = null;

    transactions.forEach((transaction) => {
        const amount = toNumber(transaction.amount);
        total += amount;
        if (!highest || amount > toNumber(highest.amount)) highest = transaction;
    });

    return {total, count: transactions.length, highest};
};

// Percentage change versus a previous value; null when there is no baseline
export const percentChange = (current, previous) =>
    previous ? ((current - previous) / Math.abs(previous)) * 100 : null;

// Groups by category, sorts by amount and folds the tail into "Other"
export const groupByCategory = (transactions = [], limit = 5) => {
    const totals = new Map();

    transactions.forEach((transaction) => {
        const name = categoryLabel(transaction) || "Uncategorized";
        totals.set(name, (totals.get(name) || 0) + toNumber(transaction.amount));
    });

    const sorted = [...totals.entries()]
        .map(([name, amount]) => ({name, amount}))
        .sort((a, b) => b.amount - a.amount);

    if (sorted.length <= limit) return sorted;

    const otherAmount = sorted.slice(limit - 1).reduce((sum, item) => sum + item.amount, 0);
    return [...sorted.slice(0, limit - 1), {name: "Other", amount: otherAmount}];
};

// One point per day of the month (up to today for the current month), zero-filled
export const buildDailySeries = (transactions = [], month = moment()) => {
    const start = month.clone().startOf("month");
    const days = month.isSame(moment(), "month") ? moment().date() : month.daysInMonth();
    const byDate = {};

    transactions.forEach((transaction) => {
        const key = moment(transaction.date).format(DATE_FORMAT);
        if (!byDate[key]) byDate[key] = {total: 0, items: []};
        byDate[key].total += toNumber(transaction.amount);
        byDate[key].items.push({name: transaction.name, amount: toNumber(transaction.amount)});
    });

    return Array.from({length: days}, (_, index) => {
        const day = start.clone().add(index, "days");
        const key = day.format(DATE_FORMAT);

        return {
            date: key,
            day: day.date(),
            label: day.format("D MMM"),
            totalAmount: byDate[key]?.total || 0,
            items: byDate[key]?.items || [],
        };
    });
};

// Income and expense side by side for the cash-flow chart
export const buildCashFlowSeries = (incomes = [], expenses = [], month = moment()) => {
    const expenseSeries = buildDailySeries(expenses, month);

    return buildDailySeries(incomes, month).map((point, index) => ({
        date: point.date,
        day: point.day,
        label: point.label,
        income: point.totalAmount,
        expense: expenseSeries[index].totalAmount,
    }));
};

// Latest transactions across both types, newest first
export const getRecentTransactions = (incomes = [], expenses = [], limit = 6) =>
    [
        ...incomes.map((item) => ({...item, type: "income"})),
        ...expenses.map((item) => ({...item, type: "expense"})),
    ]
        .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf() || toNumber(b.id) - toNumber(a.id))
        .slice(0, limit);