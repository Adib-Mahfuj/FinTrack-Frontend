import TransactionList from "./TransactionList.jsx";

const ExpenseList = ({transactions, onDelete, onDownload, onEmail}) => (
    <TransactionList
        title="All Expenses"
        type="expense"
        transactions={transactions}
        emptyTitle="No expenses this month"
        emptyDescription="Expenses you add this month will appear here."
        onDelete={onDelete}
        onDownload={onDownload}
        onEmail={onEmail}
    />
);

export default ExpenseList;