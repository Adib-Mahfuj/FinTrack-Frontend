import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {CHART_COLORS, formatCompactNumber, formatCurrency, getNiceScale} from "../util/util.js";

const AXIS_TICK = {fontSize: 12, fill: "#64748b"};

const TooltipRow = ({label, value, color}) => (
    <div className="flex items-center justify-between gap-6">
        <dt className="flex items-center gap-1.5 text-gray-600">
            <span className="h-2 w-2 rounded-full" style={{backgroundColor: color}}/>
            {label}
        </dt>
        <dd className="font-medium text-gray-900">{value}</dd>
    </div>
);

const CashFlowTooltip = ({active, payload}) => {
    if (!active || !payload?.length) return null;

    const point = payload[0].payload;

    return (
        <div className="min-w-[190px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
            <p className="text-sm font-semibold text-gray-900">{point.label}</p>
            <dl className="mt-2 space-y-1 text-xs">
                <TooltipRow label="Income" value={formatCurrency(point.income)} color={CHART_COLORS.income}/>
                <TooltipRow label="Expense" value={formatCurrency(point.expense)} color={CHART_COLORS.expense}/>
                <div className="flex justify-between gap-6 border-t border-gray-100 pt-1 font-semibold text-gray-900">
                    <dt>Net</dt>
                    <dd>{formatCurrency(point.income - point.expense)}</dd>
                </div>
            </dl>
        </div>
    );
};

const LegendItem = ({label, color}) => (
    <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{backgroundColor: color}}/>
        {label}
    </span>
);

// Daily income vs expense as grouped bars; `data` comes from buildCashFlowSeries()
const CashFlowChart = ({data = []}) => {
    const maxValue = useMemo(
        () => Math.max(0, ...data.map((point) => Math.max(point.income, point.expense))),
        [data]
    );
    const scale = useMemo(() => getNiceScale(maxValue), [maxValue]);

    if (maxValue === 0) {
        return (
            <div className="flex h-[320px] items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
                No transactions recorded this month
            </div>
        );
    }

    return (
        <div>
            <div className="mb-3 flex items-center justify-end gap-4 text-xs text-gray-500">
                <LegendItem label="Income" color={CHART_COLORS.income}/>
                <LegendItem label="Expense" color={CHART_COLORS.expense}/>
            </div>

            <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{top: 8, right: 8, left: 0, bottom: 0}} barGap={2}>
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

                        <Tooltip content={<CashFlowTooltip/>} cursor={{fill: "#f1f5f9"}}/>

                        <Bar dataKey="income" fill={CHART_COLORS.income} radius={[3, 3, 0, 0]} maxBarSize={14}/>
                        <Bar dataKey="expense" fill={CHART_COLORS.expense} radius={[3, 3, 0, 0]} maxBarSize={14}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CashFlowChart;