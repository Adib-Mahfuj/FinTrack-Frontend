import {Trash2, TrendingDown, TrendingUp} from "lucide-react";
import {addThousandsSeparator} from "../util/util.js";
import IconTile from "./IconTile.jsx";

// The pill background only appears from the sm breakpoint up; on phones the amount is plain colored text
const AMOUNT_STYLES = {
    income: "text-emerald-700 sm:bg-emerald-50",
    expense: "text-red-700 sm:bg-red-50",
};

// Single transaction row; the delete action is revealed on hover, focus and touch devices
const TransactionInfoCard = ({icon, title, category, date, amount, type, hideDeleteBtn, onDelete}) => {
    const isIncome = type === "income";
    const TrendIcon = isIncome ? TrendingUp : TrendingDown;

    return (
        <div className="group relative mt-2 flex items-center gap-3 rounded-lg p-2.5 transition-colors duration-200 hover:bg-blue-50 sm:gap-4 sm:p-3">
            <IconTile icon={icon} size="lg"/>

            {/* Title and category; the date joins them from the sm breakpoint up */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">{title}</p>
                <p className="mt-1 truncate text-xs text-gray-500">
                    {category}
                    {category && <span className="hidden sm:inline"> • </span>}
                    <span className="hidden sm:inline">{date}</span>
                </p>
            </div>

            {/* Amount; on phones the date sits underneath it */}
            <div className="flex shrink-0 flex-col items-end sm:items-stretch">
                <div className={`flex items-center gap-2 rounded-md sm:px-3 sm:py-1.5 ${AMOUNT_STYLES[type] ?? AMOUNT_STYLES.expense}`}>
                    <h6 className="text-sm font-semibold">
                        {isIncome ? "+" : "-"}
                        <span className="font-medium text-gray-500">BDT</span>{" "}
                        {addThousandsSeparator(amount)}
                    </h6>
                    <TrendIcon size={15} className="hidden sm:block"/>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 sm:hidden">{date}</p>
            </div>

            {/* Fixed-width action column keeps the delete buttons aligned across rows */}
            {!hideDeleteBtn && (
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label={`Delete ${title}`}
                    className="-mr-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400
                               transition-all duration-200 hover:bg-red-50 hover:text-red-600
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                               opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                               [@media(hover:none)]:opacity-100">
                    <Trash2 size={16}/>
                </button>
            )}
        </div>
    );
};

export default TransactionInfoCard;