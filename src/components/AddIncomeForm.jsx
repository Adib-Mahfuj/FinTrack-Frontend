import {useEffect,useState} from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./input.jsx";

const AddIncomeForm = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: '',
    });

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name,
    }))

    const salaryCategory = categories.find(
        category => category.name.toLowerCase() === "salary"
    );

    const selectedCategoryId =
        income.categoryId || (salaryCategory ? String(salaryCategory.id) : '');

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value});
    }

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="Income Source"
                placeholder="e.g., Salary, Freelance, Bonus"
                type="text"
            />

            <Input
                label="Category"
                value={income.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={income.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                label="Amount"
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({target}) => handleChange('date', target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onAddIncome({
                        ...income,
                        categoryId: selectedCategoryId
                    })}
                    className="flex items-center gap-2 px-5 py-2.5
                               bg-blue-600 text-white
                               text-sm font-medium rounded-lg
                               hover:bg-blue-700
                               hover:shadow-sm
                               active:scale-[0.98]
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition-all duration-200">
                    Add Income
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;