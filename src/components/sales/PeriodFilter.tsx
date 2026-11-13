import type { Period } from "../../types/Sales";

interface Props {
    period: Period;
    selectedDate: string;
    onPeriodChange: (period: Period) => void;
    onDateChange: (date: string) => void;
}

export default function PeriodFilter({
    period,
    selectedDate,
    onPeriodChange,
    onDateChange
}: Props) {
    return (
        <section className="period-toolbar">
            <div>
                <h2>Statistics Overview</h2>
                <p>Analyze your shop's performance.</p>
            </div>

            <div className="period-controls">
                <select
                    value={period}
                    onChange={e => onPeriodChange(e.target.value as Period)}
                >
                    <option value="ALL">All time</option>
                    <option value="TODAY">Today</option>
                    <option value="YESTERDAY">Yesterday</option>
                    <option value="7D">Last 7 days</option>
                    <option value="30D">Last 30 days</option>
                    <option value="DATE">Specific date</option>
                </select>

                {period === "DATE" && (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => onDateChange(e.target.value)}
                    />
                )}
            </div>
        </section>
    );
}