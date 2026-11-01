import {useEffect, useState} from "react";
import Input from "./input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import {LoaderCircle} from "lucide-react";

const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing}) => {
        const [category, setCategory] = useState({
            name: "",
            type: "income",
            icon: ""
        });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({name: "", type: "income", icon: ""});
        }
    }, [isEditing, initialCategoryData]);

    const categoryTypeOptions = [
        { label: "Income", value: "income" },
        { label: "Expense", value: "expense" },
    ]

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value });
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
            value={category.name}
            onChange={({target}) => handleChange("name",target.value)}
            label="Category Name"
            placeholder="e.g., Freelance, Salary, Groceries"
            type="text"
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({target}) => handleChange("type",target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5
                               bg-blue-600 text-white
                               text-sm font-medium rounded-lg
                               hover:bg-blue-700
                               hover:shadow-sm
                               active:scale-[0.98]
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition-all duration-200">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ): (
                        <>
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
export default AddCategoryForm;
