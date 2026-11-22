import {useCallback, useEffect, useMemo, useState} from "react";
import moment from "moment";
import {Award, Plus, Receipt} from "lucide-react";
import toast from "react-hot-toast";
import Dashboard from "./Dashboard.jsx";
import PageHeader from "./PageHeader.jsx";
import Button from "./Button.jsx";
import StatCard from "./StatCard.jsx";
import Modal from "./Modal.jsx";
import DeleteAlert from "./DeleteAlert.jsx";
import TransactionOverview from "./TransactionOverview.jsx";
import TransactionList from "./TransactionList.jsx";
import AddTransactionModal from "./AddTransactionModal.jsx";
import {useUser} from "../hooks/useUser.jsx";
import usePreviousMonthSummary from "../hooks/usePreviousMonthSummary.js";
import axiosConfig from "../util/axiosConfig.jsx";
import {TRANSACTION_TYPES} from "../util/transactionTypes.js";
import {formatCurrency} from "../util/util.js";
import {percentChange, summarize} from "../util/summary.js";

// One implementation behind both the Income and the Expense pages
const TransactionPage = ({type}) => {
    useUser();

    const config = TRANSACTION_TYPES[type];
    const {endpoints} = config;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const {previous, refresh: refreshPrevious} = usePreviousMonthSummary(type);

    const summary = useMemo(() => summarize(transactions), [transactions]);
    const average = summary.count ? summary.total / summary.count : 0;
    const monthLabel = moment().format("MMMM YYYY");

    // Fetch the current month's transactions
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosConfig.get(endpoints.list);
            if (response.status === 200) setTransactions(response.data);
        } catch (error) {
            console.error(`Failed to fetch ${config.noun} details`, error);
            toast.error(error.response?.data?.message || `Failed to fetch ${config.noun} details`);
        } finally {
            setLoading(false);
        }
    }, [endpoints.list, config.noun]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // A new entry can be back-dated into last month, so refresh both views
    const refreshData = () => {
        fetchTransactions();
        refreshPrevious();
    };

    const handleDelete = async () => {
        try {
            await axiosConfig.delete(endpoints.remove(deleteId));
            toast.success(`${config.label} deleted successfully`);
            refreshData();
        } catch (error) {
            console.error(`Error deleting ${config.noun}`, error);
            toast.error(error.response?.data?.message || `Failed to delete ${config.noun}`);
        } finally {
            setDeleteId(null);
        }
    };

    // Download the current month as an Excel (.xlsx) file
    const handleDownload = async () => {
        try {
            const response = await axiosConfig.get(endpoints.download, {responseType: "blob"});
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${type}_details.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success(`${config.label} details downloaded successfully`);
        } catch (error) {
            console.error(`Error downloading ${config.noun} details`, error);
            toast.error(`Failed to download ${config.noun} details`);
        }
    };

    // Email the current month as an Excel file to the logged-in user
    const handleEmail = async () => {
        try {
            const response = await axiosConfig.get(endpoints.email);
            if (response.status === 200) toast.success(`${config.label} details emailed successfully`);
        } catch (error) {
            console.error(`Error emailing ${config.noun} details`, error);
            toast.error(error.response?.data?.message || `Failed to email ${config.noun} details`);
        }
    };

    // Skeletons only until the first data arrives
    const showSkeleton = loading && transactions.length === 0;

    return (
        <Dashboard activeMenu={config.label}>
            <div className="my-5 mx-auto">
                <PageHeader
                    title={config.label}
                    subtitle={config.pageSubtitle}
                    actions={
                        <Button icon={Plus} onClick={() => setOpenAddModal(true)}>
                            {config.addLabel}
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 gap-6">
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        <StatCard
                            label={config.totalLabel}
                            value={formatCurrency(summary.total)}
                            hint="vs last month"
                            icon={config.icon}
                            tone={config.tone}
                            trend={
                                previous
                                    ? {
                                        value: percentChange(summary.total, previous.total),
                                        positiveIsGood: config.positiveIsGood,
                                    }
                                    : undefined
                            }
                            loading={showSkeleton}
                        />
                        <StatCard
                            label="Transactions"
                            value={String(summary.count)}
                            hint={
                                summary.count
                                    ? `Avg ${formatCurrency(average)} per transaction`
                                    : `No ${config.noun} in ${monthLabel}`
                            }
                            icon={Receipt}
                            tone="blue"
                            loading={showSkeleton}
                        />
                        <StatCard
                            label={config.highestLabel}
                            value={formatCurrency(summary.highest?.amount)}
                            hint={
                                summary.highest
                                    ? `${summary.highest.name} · ${moment(summary.highest.date).format("D MMM")}`
                                    : `No ${config.noun} yet`
                            }
                            icon={Award}
                            tone={config.tone}
                            loading={showSkeleton}
                        />
                    </div>

                    {/* Daily trend */}
                    <TransactionOverview
                        title={config.overviewTitle}
                        subtitle={`${config.overviewSubtitle} in ${monthLabel}`}
                        transactions={transactions}
                        color={config.color}
                        emptyText={config.chartEmptyText}
                    />

                    {/* Transactions of the month */}
                    <TransactionList
                        title={config.listTitle}
                        type={type}
                        transactions={transactions}
                        emptyTitle={config.listEmptyTitle}
                        emptyDescription={config.listEmptyDescription}
                        onDelete={setDeleteId}
                        onDownload={handleDownload}
                        onEmail={handleEmail}
                    />

                    <AddTransactionModal
                        type={type}
                        isOpen={openAddModal}
                        onClose={() => setOpenAddModal(false)}
                        onSuccess={refreshData}
                    />

                    <Modal
                        isOpen={deleteId !== null}
                        onClose={() => setDeleteId(null)}
                        title={`Delete ${config.label}`}
                    >
                        <DeleteAlert
                            content={`Delete ${config.noun}? This action cannot be undone.`}
                            onDelete={handleDelete}
                            onCancel={() => setDeleteId(null)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default TransactionPage;