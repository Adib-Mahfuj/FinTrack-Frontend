import {useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./input.jsx";
import Button from "./Button.jsx";
import {useModal} from "./Modal.jsx";
import {canAutoFocus} from "../util/device.js";

const TYPE_OPTIONS = [
    {label: "Income", value: "income", active: "border-emerald-600 bg-emerald-50 text-emerald-700"},
    {label: "Expense", value: "expense", active: "border-red-600 bg-red-50 text-red-700"},
];

const EMPTY_CATEGORY = {name: "", type: "income", icon: ""};
const MAX_NAME_LENGTH = 50;

// Shared form for creating and editing a category
const AddCategoryForm = ({onAddCategory, onCancel, initialCategoryData, isEditing}) => {
    const {onClose} = useModal();
    const handleCancel = onCancel ?? onClose;

    // The modal unmounts its content when closed, so the form always starts from fresh state
    const [category, setCategory] = useState(() =>
        isEditing && initialCategoryData ? {...initialCategoryData} : {...EMPTY_CATEGORY}
    );
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState("");

    // Prevents submitting an edit that changes nothing
    const isUnchanged =
        isEditing &&
        initialCategoryData &&
        category.name === initialCategoryData.name &&
        category.type === initialCategoryData.type &&
        (category.icon || "") === (initialCategoryData.icon || "");

    const handleChange = (key, value) => {
        setCategory((prev) => ({...prev, [key]: value}));
        if (key === "name") setNameError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!category.name.trim()) {
            setNameError("Category name is required");
            return;
        }

        setLoading(true);
        try {
            await onAddCategory(category);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
                maxLength={MAX_NAME_LENGTH}
                error={nameError}
                autoFocus={canAutoFocus()}
            />

            {/* Type toggle */}
            <div className="mb-2">
                <p className="mb-1.5 text-sm font-medium text-gray-700">Category Type</p>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Category type">
                    {TYPE_OPTIONS.map((option) => {
                        const selected = category.type === option.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => handleChange("type", option.value)}
                                className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-200
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                    ${selected ? option.active : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                {handleCancel && (
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    loading={loading}
                    loadingText={isEditing ? "Updating..." : "Adding..."}
                    disabled={isUnchanged}
                >
                    {isEditing ? "Update Category" : "Add Category"}
                </Button>
            </div>
        </form>
    )
}

export default AddCategoryForm;