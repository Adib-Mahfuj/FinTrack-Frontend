import {useState} from "react";
import {Pencil, Plus, RefreshCw, Search, Tag, Trash2} from "lucide-react";
import {Card} from "./Card.jsx";
import Button from "./Button.jsx";
import IconTile from "./IconTile.jsx";
import {formatCurrency} from "../util/util.js";

const GROUPS = [
    {type: "income", title: "Income", dot: "bg-emerald-500"},
    {type: "expense", title: "Expense", dot: "bg-red-500"},
];

// The search box only appears once the list is long enough to need it
const SEARCH_THRESHOLD = 8;

const typeOf = (category) => category.type?.toLowerCase();
const byName = (a, b) => a.name.localeCompare(b.name);
const plural = (count, singular, pluralForm) => (count === 1 ? singular : pluralForm);

const CategoryRow = ({category, stat, statLoading, onEdit, onDelete}) => {
    let meta;
    if (statLoading) {
        meta = <span className="inline-block h-3 w-28 animate-pulse rounded bg-gray-100 align-middle"/>;
    } else if (stat) {
        meta = `${stat.count} ${plural(stat.count, "transaction", "transactions")} · ${formatCurrency(stat.total)}`;
    } else {
        meta = "No activity this month";
    }

    return (
        <li className="group flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-blue-50/60 sm:px-5">
            <IconTile icon={category.icon}/>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900" title={category.name}>
                    {category.name}
                </p>
                <p className="mt-0.5 truncate text-xs tabular-nums text-gray-500">{meta}</p>
            </div>

            {/* Revealed on hover, keyboard focus and touch devices */}
            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
                <button
                    type="button"
                    onClick={() => onEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <Pencil size={16}/>
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(category)}
                    aria-label={`Delete ${category.name}`}
                    className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <Trash2 size={16}/>
                </button>
            </div>
        </li>
    );
};

const RowsSkeleton = () => (
    <ul className="divide-y divide-gray-100" aria-hidden="true">
        {[...Array(4)].map((_, index) => (
            <li key={index} className="flex animate-pulse items-center gap-3 px-4 py-3 sm:px-5">
                <div className="h-11 w-11 rounded-lg bg-gray-100"/>
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-gray-100"/>
                    <div className="h-3 w-1/2 rounded bg-gray-100"/>
                </div>
            </li>
        ))}
    </ul>
);

// One card per category type: header with totals, then the list
const CategoryGroup = ({
                           group,
                           categories,
                           items,
                           activity,
                           activityLoading,
                           loading,
                           hasQuery,
                           onAdd,
                           onEdit,
                           onDelete,
                       }) => {
    const count = categories.length;
    const monthTotal = categories.reduce((sum, category) => sum + (activity[category.id]?.total ?? 0), 0);

    let body;
    if (loading) {
        body = <RowsSkeleton/>;
    } else if (items.length === 0) {
        body = hasQuery ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">No matching categories.</p>
        ) : (
            <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Tag className="text-gray-400" size={22}/>
                </div>
                <p className="text-sm font-medium text-gray-900">No {group.type} categories yet</p>
                <p className="mt-1 text-sm text-gray-500">Add one to start organizing your {group.type}.</p>
                <Button className="mt-4" variant="secondary" icon={Plus} onClick={() => onAdd(group.type)}>
                    Add {group.title.toLowerCase()} category
                </Button>
            </div>
        );
    } else {
        body = (
            <ul className="divide-y divide-gray-100">
                {items.map((category) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        stat={activity[category.id]}
                        statLoading={activityLoading}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        );
    }

    return (
        <Card padding="p-0" className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${group.dot}`}/>
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-gray-900">{group.title}</h3>
                        <p className="truncate text-xs tabular-nums text-gray-500">
                            {count} {plural(count, "category", "categories")}
                            {!activityLoading && ` · ${formatCurrency(monthTotal)} this month`}
                        </p>
                    </div>
                </div>

                <Button variant="ghost" size="sm" icon={Plus} onClick={() => onAdd(group.type)}>
                    Add
                </Button>
            </div>

            {body}
        </Card>
    );
};

const CategoryList = ({
                          categories,
                          activity = {},
                          activityLoading = false,
                          loading = false,
                          error = false,
                          onRetry,
                          onAddCategory,
                          onEditCategory,
                          onDeleteCategory,
                      }) => {
    const [search, setSearch] = useState("");

    const hasData = categories.length > 0;
    const query = search.trim().toLowerCase();
    const showSearch = categories.length > SEARCH_THRESHOLD;

    if (error && !hasData) {
        return (
            <Card>
                <div className="flex flex-col items-center py-12 text-center">
                    <h4 className="text-base font-semibold text-gray-900">Failed to load categories</h4>
                    <p className="mb-5 mt-1 text-sm text-gray-500">Please check your connection and try again.</p>
                    <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>
                        Try again
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div>
            {showSearch && (
                <div className="relative mb-4 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search categories"
                        aria-label="Search categories"
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-800
                                   transition-colors duration-200 placeholder:text-gray-500
                                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                {GROUPS.map((group) => {
                    const groupCategories = categories.filter((category) => typeOf(category) === group.type);
                    const items = groupCategories
                        .filter((category) => !query || category.name.toLowerCase().includes(query))
                        .sort(byName);

                    return (
                        <CategoryGroup
                            key={group.type}
                            group={group}
                            categories={groupCategories}
                            items={items}
                            activity={activity}
                            activityLoading={activityLoading}
                            loading={loading && !hasData}
                            hasQuery={Boolean(query)}
                            onAdd={onAddCategory}
                            onEdit={onEditCategory}
                            onDelete={onDeleteCategory}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryList;