import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {LoaderCircle, Plus} from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import {useEffect, useState} from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const isSameCategory = (category, name, type) =>
    category.type?.toLowerCase() === type?.toLowerCase() &&
    category.name.toLowerCase() === name.trim().toLowerCase();

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(true);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

    const closeAddModal = () => setOpenAddCategoryModal(false);

    const closeEditModal = () => {
        setOpenEditCategoryModal(false);
        setSelectedCategory(null);
    };

    const closeDeleteModal = () => {
        if (!deleting) setCategoryToDelete(null);
    };

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

        setDeleting(true);
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryToDelete.id));
            toast.success("Category deleted successfully.");
            fetchCategoryDetails();
        } catch (error) {
            console.error('Error deleting category: ', error);
            toast.error(error.response?.data?.message || "Failed to delete category.");
            if (error.response?.status === 404) fetchCategoryDetails();
        } finally {
            setDeleting(false);
            setCategoryToDelete(null);
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">

                {/* Page header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Organize your income and expenses with custom categories.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 shrink-0 whitespace-nowrap
                                   border-2 border-blue-600 text-blue-600
                                   text-sm font-medium rounded-lg
                                   hover:bg-blue-600 hover:text-white
                                   hover:shadow-sm active:scale-[0.98]
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                   transition-all duration-200 cursor-pointer">
                        <Plus size={18} strokeWidth={2.5}/>
                        Add Category
                    </button>
                </div>

                {/* Category list */}
                <CategoryList
                    categories={categoryData}
                    loading={loading}
                    error={fetchFailed}
                    onRetry={fetchCategoryDetails}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={setCategoryToDelete}
                    onAddCategory={() => setOpenAddCategoryModal(true)}
                />

                {/* Add Category Modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={closeAddModal}
                    title="Add Category"
                    maxWidth="max-w-md"
                >
                    <AddCategoryForm
                        onAddCategory={handleAddCategory}
                        onCancel={closeAddModal}
                    />
                </Modal>

                {/* Update Category Modal */}
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

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={!!categoryToDelete}
                    onClose={closeDeleteModal}
                    title="Delete Category"
                    maxWidth="max-w-md"
                >
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900">{categoryToDelete?.name}</span>?
                        This action cannot be undone.
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        A category that already has transactions cannot be deleted.
                    </p>

                    <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                            className="px-5 py-2.5 text-sm font-medium rounded-lg
                                       bg-white text-gray-700 border border-gray-200
                                       hover:bg-gray-50
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                       disabled:opacity-60 disabled:cursor-not-allowed
                                       transition-colors duration-200 cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteCategory}
                            disabled={deleting}
                            className="flex items-center gap-2 px-5 py-2.5
                                       bg-red-600 text-white text-sm font-medium rounded-lg
                                       hover:bg-red-700
                                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-red-600
                                       transition-colors duration-200 cursor-pointer">
                            {deleting ? (
                                <>
                                    <LoaderCircle className="w-4 h-4 animate-spin"/>
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </Modal>

            </div>
        </Dashboard>
    )
}

export default Category;