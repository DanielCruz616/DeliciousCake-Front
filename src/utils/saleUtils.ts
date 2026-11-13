import type { Period } from "../types/Sales";

export function formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getDateOffset(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return formatDateInput(date);
}

export function getPeriodLabel(period: Period): string {
    const labels: Record<Period, string> = {
        ALL: "All time",
        TODAY: "Today",
        YESTERDAY: "Yesterday",
        "7D": "Last 7 days",
        "30D": "Last 30 days",
        DATE: "Selected date"
    };

    return labels[period];
}