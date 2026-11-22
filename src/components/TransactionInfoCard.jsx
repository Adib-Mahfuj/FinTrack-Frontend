import {Trash2, TrendingDown, TrendingUp} from "lucide-react";
import {addThousandsSeparator} from "../util/util.js";
import IconTile from "./IconTile.jsx";

const AMOUNT_STYLES = {
    income: "bg-emerald-50 text-emerald-700",
    expense: "bg-red-50 text-red-700",
};

// Single transaction row; the delete action is revealed on hover, focus and touch devices
const TransactionInfoCard = ({icon, title, category, date, amount, type, hideDeleteBtn, onDelete}) => {
    const isIncome = type === "income";
    const TrendIcon = isIncome ? TrendingUp : TrendingDown;
    const meta = [category, date].filter(Boolean).join(" • ");

    return (
        <div className="group relative mt-2 flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-blue-50 sm:gap-4">
            <IconTile icon={icon} size="lg"/>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{title}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{meta}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    {!hideDeleteBtn && (
                        <button
                            type="button"
                            onClick={onDelete}
                            aria-label={`Delete ${title}`}
                            className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
                                       opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                                       [@media(hover:none)]:opacity-100 sm:p-2 cursor-pointer">
                            <Trash2 size={16}/>
                        </button>
                    )}

                    <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5 ${AMOUNT_STYLES[type] ?? AMOUNT_STYLES.expense}`}>
                        <h6 className="text-xs font-semibold sm:text-sm">
                            {isIncome ? "+" : "-"}
                            <span className="font-medium text-gray-500">BDT</span>{" "}
                            {addThousandsSeparator(amount)}
                        </h6>
                        <TrendIcon size={15} className="hidden sm:block"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionInfoCard;