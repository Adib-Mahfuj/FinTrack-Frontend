import {useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./input.jsx";
import Button from "./Button.jsx";
import {useModal} from "./Modal.jsx";
import {getLocalDateString} from "../util/dateUtil.js";
import {canAutoFocus} from "../util/device.js";

const MAX_NAME_LENGTH = 100;

// Validates the form values and returns an { field: message } map
const validate = (values, nameLabel) => {
    const errors = {};
    const amount = Number(values.amount);

    if (!values.name.trim()) errors.name = `${nameLabel} is required`;
    if (!values.amount || Number.isNaN(amount) || amount <= 0) errors.amount = "Enter an amount greater than 0";
    if (!values.date) errors.date = "Select a date";
    else if (values.date > getLocalDateString()) errors.date = "Date cannot be in the future";
    if (!values.categoryId) errors.categoryId = "Select a category";

    return errors;
};

// Shared add form for income and expense
const AddTransactionForm = ({
                                type,
                                categories = [],
                                categoriesLoading = false,
                                onSubmit,
                                nameLabel,
                                namePlaceholder,
                                submitLabel,
                                preferredCategoryName,
                            }) => {
    const {onClose} = useModal();
    const [transaction, setTransaction] = useState(() => ({
        name: "",
        amount: "",
        date: getLocalDateString(),
        icon: "",
        categoryId: "",
    }));
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const hasCategories = categories.length > 0;
    const categoryOptions = hasCategories
        ? categories.map((category) => ({value: category.id, label: category.name}))
        : [{value: "", label: categoriesLoading ? "Loading categories..." : "No categories available"}];

    // Preselect the preferred category (if any), otherwise the first one,
    // so the dropdown always shows exactly what will be submitted
    const defaultCategory =
        categories.find((category) => category.name.toLowerCase() === preferredCategoryName) ?? categories[0];
    const selectedCategoryId = transaction.categoryId || (defaultCategory ? String(defaultCategory.id) : "");

    const handleChange = (key, value) => {
        setTransaction((prev) => ({...prev, [key]: value}));
        setErrors((prev) => ({...prev, [key]: undefined}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const values = {...transaction, categoryId: selectedCategoryId};
        const validationErrors = validate(values, nameLabel);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await onSubmit(values);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <EmojiPickerPopup
                icon={transaction.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={transaction.name}
                onChange={({target}) => handleChange("name", target.value)}
                label={nameLabel}
                placeholder={namePlaceholder}
                type="text"
                maxLength={MAX_NAME_LENGTH}
                error={errors.name}
                autoFocus={canAutoFocus()}
            />

            <Input
                label="Category"
                value={selectedCategoryId}
                onChange={({target}) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
                disabled={!hasCategories}
                error={errors.categoryId}
                helperText={
                    !hasCategories && !categoriesLoading
                        ? `No ${type} categories yet. Create one on the Category page first.`
                        : undefined
                }
            />

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Input
                    value={transaction.amount}
                    onChange={({target}) => handleChange("amount", target.value)}
                    label="Amount"
                    placeholder="0.00"
                    type="number"
                    prefix="BDT"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    error={errors.amount}
                />

                <Input
                    value={transaction.date}
                    onChange={({target}) => handleChange("date", target.value)}
                    label="Date"
                    type="date"
                    max={getLocalDateString()}
                    error={errors.date}
                />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                {onClose && (
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" loading={loading} loadingText="Adding..." disabled={!hasCategories}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};

export default AddTransactionForm;