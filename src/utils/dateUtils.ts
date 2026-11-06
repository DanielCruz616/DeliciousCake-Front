
/** Converts an API date (YYYY-MM-DD) to a local Date without timezone shifts. */
export function parseDate(value: string): Date {
    const [year, month, day] = value.substring(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
}

/** Converts a Date to DD/MM/YYYY for display. */
export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

/** Converts a Date to YYYY-MM-DD for the API and date comparisons. */
export function toApiDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
