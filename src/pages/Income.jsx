import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {getLocalDateString} from "../util/dateUtil.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const closeDeleteAlert = () => setOpenDeleteAlert({show: false, data: null});

    // Fetch the current month's incomes
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch income details', error);
            toast.error(error.response?.data?.message || "Failed to fetch income details");
        } finally {
            setLoading(false);
        }
    }

    // Fetch income categories for the add form
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch income categories details', error);
            toast.error(error.response?.data?.message || "Failed to fetch income categories details");
        }
    }

    // Validate and save a new income
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;

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
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name: name.trim(),
                amount: Number(amount),
                date,
                icon,
                categoryId,
            })

            if (response.status === 201) {
                setOpenAddIncomeModal(false);
                toast.success("Income added successfully");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.log("Error adding income", error);
            toast.error(error.response?.data?.message || "Failed to adding income");
        }
    }

    // Delete an income by id
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            closeDeleteAlert();
            toast.success("Income deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.log('Error deleting income', error);
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    }

    // Download the current month's incomes as an Excel (.xlsx) file
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD,
                {responseType: "blob"}
            );
            const filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Download income details successfully");
        } catch (error) {
            console.error("Error downloading income details:", error);
            toast.error("Failed to download income");
        }
    };

    // Email the current month's incomes as an Excel file to the logged-in user
    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);

            if (response.status === 200) {
                toast.success("Income details emailed successfully");
            }
        } catch (error) {
            console.error("Error emailing income details:", error);
            toast.error(error.response?.data?.message || "Failed to email income details");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* Overview with line chart */}
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    {/* Income sources */}
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />

                    {/* Add income modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title="Add income"
                    >
                        <AddIncomeForm
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete income modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={closeDeleteAlert}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Delete income? This action cannot be undone."
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                            onCancel={closeDeleteAlert}
                        />
                    </Modal>

                </div>
            </div>
        </Dashboard>
    )
}

export default Income;