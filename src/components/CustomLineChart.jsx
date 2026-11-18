import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Hover korle je box ta ashe
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload; // oi point er full data (month, totalAmount, items)

    return (
        <div className="bg-white shadow-lg rounded-lg p-3 border border-slate-200 min-w-[170px]">
            <p className="text-sm font-semibold text-slate-800 mb-1 pb-1 border-b border-slate-100">
                {point.month}
            </p>

            <p className="text-sm font-semibold text-slate-800 py-1 border-b border-slate-100">
                Total:{" "}
                <span className="text-purple-700">
                    BDT {point.totalAmount.toLocaleString()}
                </span>
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-2 mb-1">Details:</p>
            {point.items.map((item, index) => (
                <p key={index} className="text-xs text-slate-600">
                    {item.name}:{" "}
                    <span className="font-medium">
                        BDT {item.amount.toLocaleString()}
                    </span>
                </p>
            ))}
        </div>
    );
};

const CustomLineChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-sm text-slate-400">
                No income data to show yet
            </div>
        );
    }

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    {/* Niche fade hoye jawa purple gradient */}
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="none" />

                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#475569" }}
                        stroke="none"
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#475569" }}
                        stroke="none"
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Area
                        type="monotone"            // smooth curve
                        dataKey="totalAmount"      // data er kon field chart e jabe
                        stroke="#7c3aed"
                        strokeWidth={3}
                        fill="url(#incomeGradient)"
                        dot={{ r: 4, fill: "#7c3aed" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomLineChart;