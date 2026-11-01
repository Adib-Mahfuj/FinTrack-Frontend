import {Pencil, Wallet} from "lucide-react";

const CategoryList = ({categories, onEditCategory}) => {
    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Categories</h4>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
                <p className="text-gray-500">
                    No categories added yet. Add some to get started.
                </p>
            ): (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">

                            {/* Icon/Emoji Display */}
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full shrink-0">
                                {category.icon ? (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="h-5 w-5"
                                    />
                                ): (
                                    <Wallet className="text-blue-600" size={22} />
                                )}
                            </div>

                            {/* Category Details */}
                            <div className="flex-1 flex items-center justify-between">
                                {/* Category Name and Type */}
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 capitalize">
                                        {category.type}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEditCategory(category)}
                                        className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-colors duration-200 cursor-pointer">
                                        <Pencil size={18}/>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryList;