import {Download, Inbox, Mail} from "lucide-react";
import moment from "moment";
import {useState} from "react";
import {Card, CardHeader} from "./Card.jsx";
import Button from "./Button.jsx";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import {categoryLabel} from "../util/summary.js";

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
        <Card>
            <CardHeader
                title={title}
                subtitle={`Transactions in ${moment().format("MMMM YYYY")}`}
                action={
                    <>
                        <Button
                            variant="secondary"
                            icon={Mail}
                            loading={emailLoading}
                            loadingText="Emailing..."
                            disabled={isBusy}
                            onClick={() => runWithLoading(onEmail, setEmailLoading)}
                        >
                            Email
                        </Button>
                        <Button
                            variant="secondary"
                            icon={Download}
                            loading={downloadLoading}
                            loadingText="Downloading..."
                            disabled={isBusy}
                            onClick={() => runWithLoading(onDownload, setDownloadLoading)}
                        >
                            Export Excel
                        </Button>
                    </>
                }
            />

            {isEmpty ? (
                <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <Inbox className="text-gray-400" size={22}/>
                    </div>
                    <h6 className="text-base font-semibold text-gray-900">{emptyTitle}</h6>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">{emptyDescription}</p>
                </div>
            ) : (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2">
                    {transactions.map((transaction) => (
                        <TransactionInfoCard
                            key={transaction.id}
                            title={transaction.name}
                            icon={transaction.icon}
                            category={categoryLabel(transaction)}
                            date={moment(transaction.date).format("DD-MM-YYYY")}
                            amount={transaction.amount}
                            type={type}
                            onDelete={() => onDelete(transaction.id)}
                        />
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TransactionList;