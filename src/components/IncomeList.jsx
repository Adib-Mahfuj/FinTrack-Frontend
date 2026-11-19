import {Download, LoaderCircle, Mail} from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";
import {useState} from "react";

const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => {
    const [emailLoading, setEmailLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleEmail = async () => {
        setEmailLoading(true);
        try {
            await onEmail();
        } finally {
            setEmailLoading(false);
        }
    }
    const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            await onDownload();
        } finally {
            setDownloadLoading(false);
        }
    }
    return (
        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h5 className="text-xl font-semibold text-slate-800 tracking-tight">
                    Income Sources
                </h5>

                {/* Button Container */}
                <div className="flex items-center gap-2.5">
                    {/* Email Button */}
                    <button
                        disabled={emailLoading || downloadLoading}
                        className="group flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleEmail}>
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

                    {/* Download Button */}
                    <button
                        disabled={emailLoading || downloadLoading}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg transition-all duration-200 hover:bg-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleDownload}>
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

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* display the incomes*/}
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income.id}
                        title={income.name}
                        icon={income.icon}
                        date={moment(income.date).format('DD-MM-YYYY')}
                        amount={income.amount}
                        type="income"
                        onDelete={() => onDelete(income.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default IncomeList;