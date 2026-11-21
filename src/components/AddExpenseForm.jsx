import {useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./input.jsx";
import {LoaderCircle} from "lucide-react";

const AddExpenseForm = ({onAddExpense, categories}) => {
    const [expense, setExpense] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: '',
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name,
    }))

    // Income form-e "salary" default chilo. Expense-er kono fixed category nei,
    // tai user kichu select na korle prothom category dhora hobe
    const selectedCategoryId =
        expense.categoryId || (categories.length > 0 ? String(categories[0].id) : '');

    const handleChange = (key, value) => {
        setExpense({...expense, [key]: value});
    }

    const handleAddExpense = async () => {
        setLoading(true);
        try{
            await onAddExpense({
                ...expense,
                categoryId: selectedCategoryId
            });
        }finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="Expense Name"
                placeholder="e.g., Rent, Groceries, Transport"
                type="text"
            />

            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                label="Amount"
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({target}) => handleChange('date', target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAddExpense}
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
                            Adding...
                        </>
                    ): (
                        <>
                            Add Expense
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddExpenseForm;