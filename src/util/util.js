// Colors shared by every chart
export const CHART_COLORS = {
    income: "#059669", // emerald-600
    expense: "#dc2626", // red-600
};

export const addThousandsSeparator = (num) => {
    if (num === null || num === undefined || num === "" || isNaN(Number(num))) {
        return "";
    }

    return Number(num).toLocaleString("en-IN");
};

// Formats an amount as "BDT 1,00,000" (negative values: "-BDT 5,000")
export const formatCurrency = (amount) => {
    const value = Number(amount) || 0;
    return `${value < 0 ? "-" : ""}BDT ${addThousandsSeparator(Math.abs(value))}`;
};

// Compact notation for chart axes, e.g. 50000 -> "50K", 100000 -> "100K"
export const formatCompactNumber = (num) =>
    new Intl.NumberFormat("en", {notation: "compact", maximumFractionDigits: 1}).format(Number(num) || 0);

// Builds a "nice" y-axis (0, 25K, 50K, ...) whose top tick always covers maxValue
export const getNiceScale = (maxValue, tickCount = 4) => {
    if (!maxValue || maxValue <= 0) return {max: 1, ticks: [0, 1]};

    const rawStep = maxValue / tickCount;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const residual = rawStep / magnitude;
    const factor = [1, 2, 2.5, 5, 10].find((candidate) => residual <= candidate);
    const step = factor * magnitude;
    const max = Math.ceil(maxValue / step) * step;
    const ticks = Array.from({length: Math.round(max / step) + 1}, (_, index) => index * step);

    return {max, ticks};
};