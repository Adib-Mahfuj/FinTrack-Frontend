import {useMemo} from "react";
import {Card, CardHeader} from "./Card.jsx";
import DailyBarChart from "./DailyBarChart.jsx";
import {buildDailySeries} from "../util/summary.js";

// Shared chart card for the income and expense pages
const TransactionOverview = ({title, subtitle, transactions, color, emptyText}) => {
    const chartData = useMemo(() => buildDailySeries(transactions), [transactions]);

    return (
        <Card>
            <CardHeader title={title} subtitle={subtitle}/>
            <div className="mt-6">
                <DailyBarChart data={chartData} color={color} emptyText={emptyText}/>
            </div>
        </Card>
    );
};

export default TransactionOverview;