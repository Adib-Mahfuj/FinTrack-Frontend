import {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {PiggyBank, Plus, RefreshCw, TrendingDown, TrendingUp, Wallet} from "lucide-react";
import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import {Card, CardHeader} from "../components/Card.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";
import StatCard from "../components/StatCard.jsx";
import CashFlowChart from "../components/CashFlowChart.jsx";
import CategoryBreakdown from "../components/CategoryBreakdown.jsx";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import AddTransactionModal from "../components/AddTransactionModal.jsx";
import {formatCurrency} from "../util/util.js";
import {
    buildCashFlowSeries,
    categoryLabel,
    getRecentTransactions,
    groupByCategory,
    percentChange,
    summarize,
} from "../util/summary.js";

const FILTER_PATH = "/filter";

const ListSkeleton = () => (
    <div className="animate-pulse space-y-3 pt-2" aria-hidden="true">
        {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-3">
                <div className="h-12 w-12 rounded-lg bg-gray-100"/>
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-gray-100"/>
                    <div className="h-3 w-1/5 rounded bg-gray-100"/>
                </div>
                <div className="h-8 w-24 rounded-md bg-gray-100"/>
            </div>
        ))}
    </div>
);

const Home = () => {
    useUser();

    const {incomes, expenses, previousIncomes, previousExpenses, totals, loading, error, reload} =
        useDashboardData();
    const [addType, setAddType] = useState(null); // "income" | "expense" | null
    const monthLabel = moment().format("MMMM YYYY");

    const closeAddModal = () => setAddType(null);

    // This month's KPIs and month-over-month changes
    const stats = useMemo(() => {
        const income = summarize(incomes).total;
        const expense = summarize(expenses).total;
        const previousIncome = summarize(previousIncomes).total;
        const previousExpense = summarize(previousExpenses).total;
        const net = income - expense;

        return {
            income,
            expense,
            net,
            savingsRate: income > 0 ? (net / income) * 100 : null,
            incomeChange: percentChange(income, previousIncome),
            expenseChange: percentChange(expense, previousExpense),
        };
    }, [incomes, expenses, previousIncomes, previousExpenses]);

    const cashFlow = useMemo(() => buildCashFlowSeries(incomes, expenses), [incomes, expenses]);
    const expenseBreakdown = useMemo(() => groupByCategory(expenses), [expenses]);
    const incomeBreakdown = useMemo(() => groupByCategory(incomes), [incomes]);
    const recent = useMemo(() => getRecentTransactions(incomes, expenses), [incomes, expenses]);

    return (
        <Dashboard activeMenu="Dashboard">
            <div className="my-5 mx-auto">
                <PageHeader
                    title="Dashboard"
                    subtitle={`Your financial overview for ${monthLabel}`}
                    actions={
                        <>
                            <Button variant="secondary" icon={Plus} onClick={() => setAddType("income")}>
                                Add Income
                            </Button>
                            <Button icon={Plus} onClick={() => setAddType("expense")}>
                                Add Expense
                            </Button>
                        </>
                    }
                />

                {error ? (
                    <Card>
                        <div className="flex flex-col items-center py-12 text-center">
                            <h6 className="text-base font-semibold text-gray-900">Failed to load your dashboard</h6>
                            <p className="mt-1 mb-5 text-sm text-gray-500">
                                Please check your connection and try again.
                            </p>
                            <Button variant="secondary" icon={RefreshCw} onClick={reload}>
                                Try again
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {/* KPI cards */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                            <StatCard
                                label="Total balance"
                                value={totals ? formatCurrency(totals.totalBalance) : "—"}
                                hint="All-time income minus expenses"
                                icon={Wallet}
                                tone="blue"
                                loading={loading}
                            />
                            <StatCard
                                label="Income"
                                value={formatCurrency(stats.income)}
                                hint="vs last month"
                                icon={TrendingUp}
                                tone="emerald"
                                trend={{value: stats.incomeChange, positiveIsGood: true}}
                                loading={loading}
                            />
                            <StatCard
                                label="Expenses"
                                value={formatCurrency(stats.expense)}
                                hint="vs last month"
                                icon={TrendingDown}
                                tone="red"
                                trend={{value: stats.expenseChange, positiveIsGood: false}}
                                loading={loading}
                            />
                            <StatCard
                                label="Net savings"
                                value={formatCurrency(stats.net)}
                                hint={
                                    stats.savingsRate === null
                                        ? "No income this month"
                                        : `${stats.savingsRate.toFixed(0)}% of income saved`
                                }
                                icon={PiggyBank}
                                tone={stats.net >= 0 ? "emerald" : "red"}
                                loading={loading}
                            />
                        </div>

                        {/* Cash flow + spending breakdown */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader title="Cash flow" subtitle={`Daily income and expenses in ${monthLabel}`}/>
                                <div className="mt-5">
                                    {loading ? (
                                        <div className="h-[320px] animate-pulse rounded-lg bg-gray-100"/>
                                    ) : (
                                        <CashFlowChart data={cashFlow}/>
                                    )}
                                </div>
                            </Card>

                            <CategoryBreakdown
                                title="Spending by category"
                                subtitle={`Where your money went in ${monthLabel}`}
                                items={expenseBreakdown}
                                tone="red"
                                emptyText="No expenses recorded this month"
                                loading={loading}
                            />
                        </div>

                        {/* Recent activity + income breakdown */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <Card className="xl:col-span-2">
                                <CardHeader
                                    title="Recent transactions"
                                    subtitle="Latest activity this month"
                                    action={
                                        <Link
                                            to={FILTER_PATH}
                                            className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
                                        >
                                            View all
                                        </Link>
                                    }
                                />

                                {loading ? (
                                    <ListSkeleton/>
                                ) : recent.length === 0 ? (
                                    <p className="py-10 text-center text-sm text-gray-500">
                                        No transactions recorded this month
                                    </p>
                                ) : (
                                    <div className="mt-2">
                                        {recent.map((transaction) => (
                                            <TransactionInfoCard
                                                key={`${transaction.type}-${transaction.id}`}
                                                title={transaction.name}
                                                icon={transaction.icon}
                                                category={categoryLabel(transaction)}
                                                date={moment(transaction.date).format("DD-MM-YYYY")}
                                                amount={transaction.amount}
                                                type={transaction.type}
                                                hideDeleteBtn
                                            />
                                        ))}
                                    </div>
                                )}
                            </Card>

                            <CategoryBreakdown
                                title="Income by category"
                                subtitle={`Where your money came from in ${monthLabel}`}
                                items={incomeBreakdown}
                                tone="emerald"
                                emptyText="No income recorded this month"
                                loading={loading}
                            />
                        </div>
                    </div>
                )}

                {/* Quick add modals; the dashboard refreshes in place after a save */}
                <AddTransactionModal
                    type="income"
                    isOpen={addType === "income"}
                    onClose={closeAddModal}
                    onSuccess={reload}
                />
                <AddTransactionModal
                    type="expense"
                    isOpen={addType === "expense"}
                    onClose={closeAddModal}
                    onSuccess={reload}
                />
            </div>
        </Dashboard>
    );
};

export default Home;