export const addThousandsSeparator = (num) => {
    if (num === null || num === undefined || num === "" || isNaN(Number(num))) {
        return "";
    }

    return Number(num).toLocaleString("en-IN");
};