// Static sample data (not real user data)
const PREVIEW_STATS = [
    {label: "Income", value: "BDT 85,000", tone: "text-emerald-700"},
    {label: "Expenses", value: "BDT 32,400", tone: "text-red-700"},
    {label: "Net savings", value: "BDT 52,600", tone: "text-blue-700"},
];

// [income, expense] bar heights in percent
const PREVIEW_BARS = [
    [0, 18], [62, 0], [0, 0], [48, 12], [0, 34], [0, 0],
    [0, 8], [0, 0], [88, 0], [0, 22], [0, 0], [30, 6],
];

const PREVIEW_ROWS = [
    {title: "Salary", meta: "Salary • 1 Nov", amount: "+BDT 60,000", tone: "bg-emerald-50 text-emerald-700"},
    {title: "House rent", meta: "Rent • 3 Nov", amount: "-BDT 20,000", tone: "bg-red-50 text-red-700"},
    {title: "Groceries", meta: "Groceries • 5 Nov", amount: "-BDT 2,400", tone: "bg-red-50 text-red-700"},
];

// Lightweight, static look-alike of the dashboard (no chart library needed)
const ProductPreview = ({className = ""}) => (
    <div
        role="img"
        aria-label="Preview of the FinTrack dashboard with sample data"
        className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl ${className}`}
    >
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300"/>
            <span className="ml-auto text-xs text-gray-500">Sample data</span>
        </div>

        <div className="space-y-5 p-5">
            <div className="grid grid-cols-3 gap-3">
                {PREVIEW_STATS.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-gray-200 p-3">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className={`mt-1 text-xs font-semibold sm:text-sm ${stat.tone}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-3 text-xs font-medium text-gray-700">Cash flow</p>
                <div className="flex h-28 items-end gap-1.5">
                    {PREVIEW_BARS.map(([income, expense], index) => (
                        <div key={index} className="flex h-full flex-1 items-end gap-0.5">
                            <div className="w-full rounded-t bg-emerald-500" style={{height: `${income}%`}}/>
                            <div className="w-full rounded-t bg-red-500" style={{height: `${expense}%`}}/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {PREVIEW_ROWS.map((row) => (
                    <div key={row.title} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-gray-800">{row.title}</p>
                            <p className="truncate text-xs text-gray-500">{row.meta}</p>
                        </div>
                        <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${row.tone}`}>
                            {row.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ProductPreview;