import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import useCategoryActivity from "../hooks/useCategoryActivity.js";
import {Plus} from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";

// A duplicate is the same name within the same type (mirrors the backend rule)
const isSameCategory = (category, name, type) =>
    category.type?.toLowerCase() === type?.toLowerCase() &&
    category.name.toLowerCase() === name.trim().toLowerCase();

const Category = () => {
    useUser();
    const {activity, loading: activityLoading} = useCategoryActivity();

    const [loading, setLoading] = useState(true);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [addType, setAddType] = useState(null); // "income" | "expense" | null (closed)
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategoryDetails = async () => {
        setLoading(true);
        setFetchFailed(false);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories: ', error);
            setFetchFailed(true);
            toast.error(error.response?.data?.message || "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const closeAddModal = () => setAddType(null);

    const closeEditModal = () => {
        setOpenEditCategoryModal(false);
        setSelectedCategory(null);
    };

    const closeDeleteModal = () => setCategoryToDelete(null);

    const handleAddCategory = async (category) => {
        const {name, type, icon} = category;

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (categoryData.some((c) => isSameCategory(c, name, type))) {
            toast.error("Category name already exists for this type");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name: name.trim(),
                type,
                icon
            });
            if (response.status === 201) {
                toast.success("Category added successfully.");
                closeAddModal();
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error('Error adding category: ', error);
            toast.error(error.response?.data?.message || "Failed to add category.");
        }
    }

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory = async (updatedCategory) => {
        const {id, name, type, icon} = updatedCategory;

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!id) {
            toast.error("Category id is missing for update");
            return;
        }

        // Exclude the category being edited from the duplicate check
        if (categoryData.some((c) => c.id !== id && isSameCategory(c, name, type))) {
            toast.error("Category name already exists for this type");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
                name: name.trim(),
                type,
                icon
            });
            closeEditModal();
            toast.success("Category updated successfully.");
            fetchCategoryDetails();
        } catch (error) {
            console.error('Error updating category: ', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update category.");
        }
    }

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryToDelete.id));
            toast.success("Category deleted successfully.");
            fetchCategoryDetails();
        } catch (error) {
            console.error('Error deleting category: ', error);
            toast.error(error.response?.data?.message || "Failed to delete category.");
            // Refresh when the category was already removed elsewhere
            if (error.response?.status === 404) fetchCategoryDetails();
        } finally {
            // Always close: a category with transactions can never be deleted
            setCategoryToDelete(null);
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                <PageHeader
                    title="Categories"
                    subtitle="Organize your income and expenses with custom categories."
                    actions={
                        <Button icon={Plus} onClick={() => setAddType("income")}>
                            Add Category
                        </Button>
                    }
                />

                <CategoryList
                    categories={categoryData}
                    activity={activity}
                    activityLoading={activityLoading}
                    loading={loading}
                    error={fetchFailed}
                    onRetry={fetchCategoryDetails}
                    onAddCategory={setAddType}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={setCategoryToDelete}
                />

                {/* Add category modal */}
                <Modal
                    isOpen={addType !== null}
                    onClose={closeAddModal}
                    title="Add Category"
                    maxWidth="max-w-md"
                >
                    <AddCategoryForm
                        defaultType={addType ?? "income"}
                        onAddCategory={handleAddCategory}
                        onCancel={closeAddModal}
                    />
                </Modal>

                {/* Update category modal */}
                <Modal
                    isOpen={openEditCategoryModal}
                    onClose={closeEditModal}
                    title="Update Category"
                    maxWidth="max-w-md"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        onCancel={closeEditModal}
                        isEditing={true}
                    />
                </Modal>

                {/* Delete category modal */}
                <Modal
                    isOpen={!!categoryToDelete}
                    onClose={closeDeleteModal}
                    title="Delete Category"
                    maxWidth="max-w-md"
                >
                    <DeleteAlert
                        content={`Delete "${categoryToDelete?.name ?? ""}"? This action cannot be undone. A category that already has transactions cannot be deleted.`}
                        onDelete={handleDeleteCategory}
                        onCancel={closeDeleteModal}
                    />
                </Modal>

            </div>
        </Dashboard>
    )
}

export default Category;