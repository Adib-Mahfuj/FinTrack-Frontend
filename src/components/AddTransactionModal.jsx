import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal.jsx";
import AddTransactionForm from "./AddTransactionForm.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import {TRANSACTION_TYPES} from "../util/transactionTypes.js";

// Self-contained "add income / add expense" flow, reused by the dashboard and both pages
const AddTransactionModal = ({type, isOpen, onClose, onSuccess}) => {
    const config = TRANSACTION_TYPES[type];
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Re-fetch categories every time the modal opens so new categories show up immediately
    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        setCategoriesLoading(true);

        axiosConfig
            .get(API_ENDPOINTS.CATEGORY_BY_TYPE(type), {signal: controller.signal})
            .then((response) => setCategories(Array.isArray(response.data) ? response.data : []))
            .catch((error) => {
                if (axios.isCancel(error)) return;
                console.error(`Failed to fetch ${config.noun} categories`, error);
                toast.error(error.response?.data?.message || `Failed to fetch ${config.noun} categories`);
            })
            .finally(() => {
                if (!controller.signal.aborted) setCategoriesLoading(false);
            });

        return () => controller.abort();
    }, [isOpen, type, config.noun]);

    // The form validates inline, so this only talks to the API
    const handleSubmit = async (values) => {
        try {
            const response = await axiosConfig.post(config.endpoints.add, {
                name: values.name.trim(),
                amount: Number(values.amount),
                date: values.date,
                icon: values.icon,
                categoryId: values.categoryId,
            });

            if (response.status === 201) {
                toast.success(`${config.label} added successfully`);
                onClose();
                onSuccess?.();
            }
        } catch (error) {
            console.error(`Error adding ${config.noun}`, error);
            toast.error(error.response?.data?.message || `Failed to add ${config.noun}`);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={config.addLabel}>
            <AddTransactionForm
                type={type}
                categories={categories}
                categoriesLoading={categoriesLoading}
                onSubmit={handleSubmit}
                nameLabel={config.nameLabel}
                namePlaceholder={config.namePlaceholder}
                submitLabel={config.addLabel}
                preferredCategoryName={config.preferredCategoryName}
            />
        </Modal>
    );
};

export default AddTransactionModal;