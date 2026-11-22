import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatCompactNumber, formatCurrency, getNiceScale} from "../util/util.js";

const MAX_TOOLTIP_ITEMS = 5;
const AXIS_TICK = {fontSize: 12, fill: "#64748b"};

const DayTooltip = ({active, payload, color}) => {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;
    const visibleItems = point.items.slice(0, MAX_TOOLTIP_ITEMS);
    const hiddenCount = point.items.length - visibleItems.length;

    return (
        <div className="min-w-[180px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <p className="text-sm font-semibold text-gray-900">{point.label}</p>
            <p className="mt-1 text-sm font-semibold" style={{color}}>
                {formatCurrency(point.totalAmount)}
            </p>

            {visibleItems.length > 0 ? (
                <ul className="mt-2 space-y-0.5 border-t border-gray-100 pt-2">
                    {visibleItems.map((item, index) => (
                        <li key={index} className="flex justify-between gap-4 text-xs text-gray-600">
                            <span className="truncate">{item.name}</span>
                            <span className="font-medium text-gray-800">{formatCurrency(item.amount)}</span>
                        </li>
                    ))}
                    {hiddenCount > 0 && <li className="text-xs text-gray-500">+{hiddenCount} more</li>}
                </ul>
            ) : (
                <p className="mt-1 text-xs text-gray-500">No transactions</p>
            )}
        </div>
    );
};

// Daily totals as a bar chart; `data` comes from buildDailySeries()
const DailyBarChart = ({data = [], color, emptyText = "No data to show yet"}) => {
    const maxValue = useMemo(() => Math.max(0, ...data.map((point) => point.totalAmount)), [data]);
    const scale = useMemo(() => getNiceScale(maxValue), [maxValue]);

    if (maxValue === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{top: 8, right: 8, left: 0, bottom: 0}}>
                    <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={{stroke: "#e2e8f0"}}
                        tick={AXIS_TICK}
                        minTickGap={12}
                    />
                    <YAxis
                        width={44}
                        domain={[0, scale.max]}
                        ticks={scale.ticks}
                        tickLine={false}
                        axisLine={false}
                        tick={AXIS_TICK}
                        tickFormatter={formatCompactNumber}
                    />

                    <Tooltip content={<DayTooltip color={color}/>} cursor={{fill: "#f1f5f9"}}/>

                    <Bar dataKey="totalAmount" fill={color} radius={[4, 4, 0, 0]} maxBarSize={24}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyBarChart;