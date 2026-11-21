import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getLocalDateString} from "../util/dateUtil.js";
import toast from "react-hot-toast";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";

const Expense = () => {
    useUser();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const closeDeleteAlert = () => setOpenDeleteAlert({show: false, data: null});

    // Fetch the current month's expenses
    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
            if (response.status === 200) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense details", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense details");
        } finally {
            setLoading(false);
        }
    };

    // Fetch expense categories for the add form
    const fetchExpenseCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense categories details", error);
            toast.error(error.response?.data?.message || "Failed to fetch expense categories details");
        }
    };

    // Validate and save a new expense
    const handleAddExpense = async (expense) => {
        const {name, amount, date, icon, categoryId} = expense;

        if (!name.trim()) {
            toast.error("Please enter a valid name");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0");
            return;
        }

        if (!date) {
            toast.error("Please select a date");
            return;
        }

        // Compare against the local date, not UTC
        if (date > getLocalDateString()) {
            toast.error("Date cannot be in the future");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name: name.trim(),
                amount: Number(amount),
                date,
                icon,
                categoryId,
            });

            if (response.status === 201) {
                setOpenAddExpenseModal(false);
                toast.success("Expense added successfully");
                fetchExpenseDetails();
                fetchExpenseCategories();
            }
        } catch (error) {
            console.log("Error adding expense", error);
            toast.error(error.response?.data?.message || "Failed to add expense");
        }
    };

    // Delete an expense by id
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
            closeDeleteAlert();
            toast.success("Expense deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.log("Error deleting expense", error);
            toast.error(error.response?.data?.message || "Failed to delete expense");
        }
    };

    // Download the current month's expenses as an Excel (.xlsx) file
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
                {responseType: "blob"}
            );
            const filename = "expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download expense details successfully");
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error("Failed to download expense");
        }
    };

    // Email the current month's expenses as an Excel file to the logged-in user
    const handleEmailExpenseDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);

            if (response.status === 200) {
                toast.success("Expense details emailed successfully");
            }
        } catch (error) {
            console.error("Error emailing expense details:", error);
            toast.error(error.response?.data?.message || "Failed to email expense details");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories();
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* Overview with line chart */}
                        <ExpenseOverview
                            transactions={expenseData}
                            onAddExpense={() => setOpenAddExpenseModal(true)}
                        />
                    </div>

                    {/* Expense list */}
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                    />

                    {/* Add expense modal */}
                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOpenAddExpenseModal(false)}
                        title="Add expense"
                    >
                        <AddExpenseForm
                            onAddExpense={(expense) => handleAddExpense(expense)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete expense modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={closeDeleteAlert}
                        title="Delete Expense"
                    >
                        <DeleteAlert
                            content="Delete expense? This action cannot be undone."
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                            onCancel={closeDeleteAlert}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Expense;