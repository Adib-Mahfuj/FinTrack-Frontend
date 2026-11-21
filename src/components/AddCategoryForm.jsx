import {useState} from "react";
import Input from "./input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import {LoaderCircle} from "lucide-react";

const TYPE_OPTIONS = [
    {label: "Income", value: "income", active: "border-emerald-600 bg-emerald-50 text-emerald-700"},
    {label: "Expense", value: "expense", active: "border-red-600 bg-red-50 text-red-700"},
];

const EMPTY_CATEGORY = {name: "", type: "income", icon: ""};

const AddCategoryForm = ({onAddCategory, onCancel, initialCategoryData, isEditing}) => {
    const [category, setCategory] = useState(() =>
        isEditing && initialCategoryData ? {...initialCategoryData} : {...EMPTY_CATEGORY}
    );
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            />
            {nameError && (
                <p className="-mt-2 mb-4 text-xs text-red-600">{nameError}</p>
            )}

            {/* Type toggle */}
            <div className="mb-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Category Type</p>
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
                                className={`px-4 py-2.5 text-sm font-medium rounded-lg border
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    transition-colors duration-200 cursor-pointer
                                    ${selected
                                    ? option.active
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-5 py-2.5 text-sm font-medium rounded-lg
                                   bg-white text-gray-700 border border-gray-200
                                   hover:bg-gray-50
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                   disabled:opacity-60 disabled:cursor-not-allowed
                                   transition-colors duration-200 cursor-pointer">
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading || isUnchanged}
                    className="flex items-center gap-2 px-5 py-2.5
                               bg-blue-600 text-white
                               text-sm font-medium rounded-lg
                               hover:bg-blue-700 hover:shadow-sm
                               active:scale-[0.98]
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               disabled:opacity-60 disabled:cursor-not-allowed
                               disabled:hover:bg-blue-600 disabled:hover:shadow-none disabled:active:scale-100
                               transition-all duration-200 cursor-pointer">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        isEditing ? "Update Category" : "Add Category"
                    )}
                </button>
            </div>
        </form>
    )
}

export default AddCategoryForm;