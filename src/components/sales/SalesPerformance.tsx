export interface ChartItem {
    label: string;
    revenue: number;
    count: number;
}

interface Props {
    data: ChartItem[];
    periodLabel: string;
}

export default function SalesPerformance({
    data,
    periodLabel
}: Props) {
    const maxRevenue = Math.max(
        ...data.map(day => day.revenue),
        1
    );

    return (
        <div className="statistics-panel">
            <div className="statistics-panel-heading">
                <div>
                    <h2>Sales Performance</h2>
                    <p>Revenue from paid sales</p>
                </div>

                <span>{periodLabel}</span>
            </div>

            <div className="daily-chart-container">
                <div className="daily-chart">
                    {data.map((day, index) => (
                        <div
                            className="daily-chart-column"
                            key={`${day.label}-${index}`}
                        >
                            <strong>
                                ${day.revenue.toLocaleString("en-US", {
                                    maximumFractionDigits: 0
                                })}
                            </strong>

                            <div className="daily-chart-track">
                                <div
                                    className="daily-chart-bar"
                                    style={{
                                        height: day.revenue > 0
                                            ? `${Math.max(
                                                day.revenue / maxRevenue * 100,
                                                3
                                            )}%`
                                            : "0%"
                                    }}
                                />
                            </div>

                            <span>{day.label}</span>
                            <small>{day.count} sales</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}