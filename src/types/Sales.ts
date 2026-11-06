export interface Sale {
    id:number;
    customerId: number | null;
    tableId: number;
    createdAt: string;
    status: "OPEN" | "CANCELLED" | "PAID";
    total: number;
}