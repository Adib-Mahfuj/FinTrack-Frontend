import {Download, Inbox, LoaderCircle, Mail} from "lucide-react";
import moment from "moment";
import {useState} from "react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";

/**
 * Shared list card for income and expense transactions.
 * Renders the header actions (email / export), the rows and the empty state.
 */
const TransactionList = ({
                             title,
                             type,
                             transactions,
                             emptyTitle,
                             emptyDescription,
                             onDelete,
                             onDownload,
                             onEmail,
                         }) => {
    const [emailLoading, setEmailLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const isBusy = emailLoading || downloadLoading;
    const isEmpty = !transactions || transactions.length === 0;

    // Runs an async action while keeping its loading flag in sync
    const runWithLoading = async (action, setLoading) => {
        setLoading(true);
        try {
            await action();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h5 className="text-xl font-semibold text-slate-800 tracking-tight">
                    {title}
                </h5>

                <div className="flex items-center gap-2.5">
                    {/* Email */}
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => runWithLoading(onEmail, setEmailLoading)}
                        className="group flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                        {emailLoading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin"/>
                                Emailing...
                            </>
                        ) : (
                            <>
                                <Mail size={16} className="text-slate-400 group-hover:text-slate-600"/>
                                <span>Email</span>
                            </>
                        )}
                    </button>

                    {/* Export */}
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => runWithLoading(onDownload, setDownloadLoading)}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg transition-all duration-200 hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                        {downloadLoading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin"/>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download size={16}/>
                                <span>Export Excel</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Rows or empty state */}
            {isEmpty ? (
                <div className="flex flex-col items-center text-center py-12">
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg mb-4">
                        <Inbox className="text-slate-400" size={22}/>
                    </div>
                    <h6 className="text-base font-semibold text-slate-800">{emptyTitle}</h6>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">{emptyDescription}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {transactions.map((transaction) => (
                        <TransactionInfoCard
                            key={transaction.id}
                            title={transaction.name}
                            icon={transaction.icon}
                            date={moment(transaction.date).format("DD-MM-YYYY")}
                            amount={transaction.amount}
                            type={type}
                            onDelete={() => onDelete(transaction.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionList;