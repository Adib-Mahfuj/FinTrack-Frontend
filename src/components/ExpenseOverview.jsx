import { useMemo } from "react";
import CustomLineChart from "./CustomLineChart.jsx";
import { prepareExpenseLineChartData } from "../util/util.js";
import { Plus } from "lucide-react";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
    const chartData = useMemo(
        () => prepareExpenseLineChartData(transactions),
        [transactions]
    );

    return (
        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h5 className="text-xl font-semibold text-slate-800 tracking-tight">
                        Expense Overview
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Track your spending over time and analyze your expense trends.
                    </p>
                </div>

                <button
                    onClick={onAddExpense}
                    className="group flex items-center gap-2 px-4 py-2.5 shrink-0
                               border-2 border-blue-600 text-blue-600
                               text-sm font-medium rounded-lg
                               hover:bg-blue-600 hover:text-white
                               hover:shadow-md hover:-translate-y-0.5
                               active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition-all duration-200"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Expense
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart
                    data={chartData}
                    emptyText="No expense data to show yet"
                    color="#dc2626"
                    gradientId="expenseGradient"
                />
            </div>
        </div>
    );
};

export default ExpenseOverview;