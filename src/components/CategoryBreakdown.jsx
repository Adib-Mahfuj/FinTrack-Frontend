import {Card, CardHeader} from "./Card.jsx";
import {addThousandsSeparator} from "../util/util.js";

const BAR_TONES = {
    emerald: "bg-emerald-500",
    red: "bg-red-500",
};

// Ranked category list with a share bar; `items` comes from groupByCategory()
const CategoryBreakdown = ({title, subtitle, items = [], tone = "red", emptyText, loading = false}) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Card>
            <CardHeader title={title} subtitle={subtitle}/>

            <div className="mt-5">
                {loading ? (
                    <div className="animate-pulse space-y-5" aria-hidden="true">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-3 w-2/3 rounded bg-gray-100"/>
                                <div className="h-1.5 rounded-full bg-gray-100"/>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">{emptyText}</p>
                ) : (
                    <ul className="space-y-4">
                        {items.map((item) => {
                            const share = total > 0 ? (item.amount / total) * 100 : 0;

                            return (
                                <li key={item.name}>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="truncate font-medium text-gray-700">{item.name}</span>
                                        <span className="shrink-0 text-gray-500">
                                            <span className="font-medium text-gray-900">
                                                BDT {addThousandsSeparator(item.amount)}
                                            </span>
                                            {" · "}
                                            {share.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div
                                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"
                                        role="progressbar"
                                        aria-label={`${item.name} share`}
                                        aria-valuenow={Math.round(share)}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className={`h-full rounded-full ${BAR_TONES[tone]}`}
                                            style={{width: `${Math.max(share, 2)}%`}}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </Card>
    );
};

export default CategoryBreakdown;