import TransactionList from "./TransactionList.jsx";

const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => (
    <TransactionList
        title="Income Sources"
        type="income"
        transactions={transactions}
        emptyTitle="No income this month"
        emptyDescription="Income you add this month will appear here."
        onDelete={onDelete}
        onDownload={onDownload}
        onEmail={onEmail}
    />
);

export default IncomeList;