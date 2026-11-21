import moment from "moment";

export const addThousandsSeparator = (num) => {
    if (num === null || num === undefined || num === "" || isNaN(Number(num))) {
        return "";
    }

    return Number(num).toLocaleString("en-IN");
};

export const prepareExpenseLineChartData = (transactions = []) =>
    prepareIncomeLineChartData(transactions);

export const prepareIncomeLineChartData = (transactions = []) => {
    const grouped = {};

    transactions.forEach((t) => {
        const key = moment(t.date).format("YYYY-MM-DD");

        if (!grouped[key]) {
            grouped[key] = {date: key, totalAmount: 0, items: []};
        }

        grouped[key].totalAmount += Number(t.amount);
        grouped[key].items.push({name: t.name, amount: Number(t.amount)});
    });


    return Object.values(grouped)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((g) => ({
            month: moment(g.date).format("Do MMM"),
            totalAmount: g.totalAmount,
            items: g.items,
        }));
};