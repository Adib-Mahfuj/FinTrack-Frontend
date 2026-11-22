import {TrendingDown, TrendingUp} from "lucide-react";
import {Card} from "./Card.jsx";

const TONES = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
};

// Percentage badge; `positiveIsGood` flips the color logic for expenses
const TrendBadge = ({value, positiveIsGood}) => {
    // No baseline (nothing recorded in the previous period): neutral dash
    if (value === null || value === undefined) {
        return (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                —
            </span>
        );
    }

    const isNeutral = Math.abs(value) < 0.05;
    const isGood = positiveIsGood ? value >= 0 : value <= 0;
    const Icon = value > 0 ? TrendingUp : TrendingDown;
    const color = isNeutral
        ? "bg-gray-100 text-gray-600"
        : isGood
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700";

    return (
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${color}`}>
            {!isNeutral && <Icon size={12}/>}
            {Math.abs(value).toFixed(1)}%
        </span>
    );
};

// KPI card: label, value, optional trend versus the previous period
const StatCard = ({label, value, hint, icon: Icon, tone = "blue", trend, loading = false}) => (
    <Card padding="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            {Icon && (
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${TONES[tone]}`}>
                    <Icon size={18}/>
                </span>
            )}
        </div>

        {loading ? (
            <div className="mt-3 animate-pulse space-y-2" aria-hidden="true">
                <div className="h-7 w-28 rounded bg-gray-100"/>
                <div className="h-4 w-20 rounded bg-gray-100"/>
            </div>
        ) : (
            <>
                <p className="mt-2 break-words text-xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-2xl">
                    {value}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-snug text-gray-500">
                    {trend && <TrendBadge value={trend.value} positiveIsGood={trend.positiveIsGood}/>}
                    {hint && <span>{hint}</span>}
                </div>
            </>
        )}
    </Card>
);

export default StatCard;