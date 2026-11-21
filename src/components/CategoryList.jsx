import {useState} from "react";
import {Pencil, Plus, RefreshCw, Search, Tag, Trash2, Wallet} from "lucide-react";

const TABS = [
    {label: "All", value: "all"},
    {label: "Income", value: "income"},
    {label: "Expense", value: "expense"},
];

const SECTIONS = [
    {value: "income", label: "Income", dot: "bg-emerald-500"},
    {value: "expense", label: "Expense", dot: "bg-red-500"},
];

const SEARCH_THRESHOLD = 8;
const GRID = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3";

const typeOf = (category) => category.type?.toLowerCase();
const byName = (a, b) => a.name.localeCompare(b.name);

const CategoryIcon = ({icon}) => {
    const [failed, setFailed] = useState(false);

    return (
        <div className="w-11 h-11 flex items-center justify-center bg-blue-50 group-hover:bg-white
                        rounded-lg shrink-0 transition-colors duration-200">
            {icon && !failed ? (
                <img
                    src={icon}
                    alt=""
                    className="h-6 w-6"
                    onError={() => setFailed(true)}
                />
            ) : (
                <Wallet className="text-blue-600" size={20}/>
            )}
        </div>
    );
};

const CategoryCard = ({category, onEdit, onDelete}) => (
    <div className="group flex items-center gap-3 p-3 border border-gray-200 rounded-lg
                    hover:border-blue-200 hover:bg-blue-50 transition-colors duration-200">
        <CategoryIcon icon={category.icon}/>

        <p className="flex-1 min-w-0 text-sm font-medium text-slate-800 truncate" title={category.name}>
            {category.name}
        </p>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100
                        [@media(hover:none)]:opacity-100 transition-opacity duration-200">
            <button
                type="button"
                onClick={() => onEdit(category)}
                aria-label={`Edit ${category.name}`}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition-colors duration-200 cursor-pointer">
                <Pencil size={16}/>
            </button>
            <button
                type="button"
                onClick={() => onDelete(category)}
                aria-label={`Delete ${category.name}`}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50
                           focus:outline-none focus:ring-2 focus:ring-red-500
                           transition-colors duration-200 cursor-pointer">
                <Trash2 size={16}/>
            </button>
        </div>
    </div>
);

const CategorySkeleton = () => (
    <div className={GRID}>
        {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg animate-pulse">
                <div className="w-11 h-11 rounded-lg bg-gray-100 shrink-0"/>
                <div className="h-3 w-28 bg-gray-100 rounded"/>
            </div>
        ))}
    </div>
);

const CategoryList = ({
                          categories,
                          onEditCategory,
                          onDeleteCategory,
                          onAddCategory,
                          onRetry,
                          loading = false,
                          error = false,
                      }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const hasData = categories.length > 0;
    const showSearch = categories.length > SEARCH_THRESHOLD;
    const query = search.trim().toLowerCase();

    const countOf = (value) =>
        value === "all"
            ? categories.length
            : categories.filter((c) => typeOf(c) === value).length;

    const sections = SECTIONS
        .filter((s) => activeTab === "all" || activeTab === s.value)
        .map((s) => ({
            ...s,
            items: categories
                .filter((c) => typeOf(c) === s.value && (!query || c.name.toLowerCase().includes(query)))
                .sort(byName),
        }))
        .filter((s) => s.items.length > 0);

    const clearFilters = () => {
        setActiveTab("all");
        setSearch("");
    };

    let content;

    if (loading && !hasData) {
        content = <CategorySkeleton/>;
    } else if (error && !hasData) {
        content = (
            <div className="flex flex-col items-center text-center py-12">
                <h4 className="text-base font-semibold text-gray-900">Failed to load categories</h4>
                <p className="text-sm text-gray-500 mt-1 mb-5">
                    Please check your connection and try again.
                </p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2.5
                               bg-white text-gray-700 text-sm font-medium rounded-lg
                               border border-gray-200 hover:bg-gray-50
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition-colors duration-200 cursor-pointer">
                    <RefreshCw size={16}/>
                    Try again
                </button>
            </div>
        );
    } else if (!hasData) {
        content = (
            <div className="flex flex-col items-center text-center py-12">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-4">
                    <Tag className="text-blue-600" size={22}/>
                </div>
                <h4 className="text-base font-semibold text-gray-900">No categories yet</h4>
                <p className="text-sm text-gray-500 mt-1 mb-5 max-w-sm">
                    Create categories to organize your income and expenses.
                </p>
                <button
                    type="button"
                    onClick={onAddCategory}
                    className="flex items-center gap-2 px-4 py-2.5
                               bg-blue-600 text-white text-sm font-medium rounded-lg
                               hover:bg-blue-700
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                               transition-colors duration-200 cursor-pointer">
                    <Plus size={16} strokeWidth={2.5}/>
                    Add Category
                </button>
            </div>
        );
    } else if (sections.length === 0) {
        content = (
            <div className="flex flex-col items-center text-center py-12">
                <p className="text-sm text-gray-500">No categories match your filters.</p>
                <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    Clear filters
                </button>
            </div>
        );
    } else {
        content = sections.map((section) => (
            <section key={section.value} className="mb-6 last:mb-0">
                {activeTab === "all" && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`h-2 w-2 rounded-full ${section.dot}`}/>
                        <h4 className="text-sm font-semibold text-gray-700">{section.label}</h4>
                        <span className="text-xs text-gray-400">{section.items.length}</span>
                    </div>
                )}
                <div className={GRID}>
                    {section.items.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={onEditCategory}
                            onDelete={onDeleteCategory}
                        />
                    ))}
                </div>
            </section>
        ));
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            {/* Toolbar: tabs + search */}
            {hasData && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                aria-pressed={activeTab === tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer
                                    ${activeTab === tab.value
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
                                {tab.label}
                                <span className="ml-1.5 text-xs text-gray-400">{countOf(tab.value)}</span>
                            </button>
                        ))}
                    </div>

                    {showSearch && (
                        <div className="relative w-full sm:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories"
                                className="w-full pl-9 pr-3 py-2 text-sm text-gray-800 bg-white
                                           border border-gray-200 rounded-lg
                                           placeholder:text-gray-400
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                           transition-colors duration-200"
                            />
                        </div>
                    )}
                </div>
            )}

            {content}
        </div>
    );
}

export default CategoryList;