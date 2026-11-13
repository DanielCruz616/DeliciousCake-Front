export interface SaleDetail {
    id: number;
    saleId: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface SaleDetailRequest {
    productId: number;
    quantity: number;
}

export interface Sale {
    id: number;
    customerId: number | null;
    tableId: number;
    createdAt: string;
    status: "OPEN" | "CANCELLED" | "PAID";
    total: number;
    details: SaleDetail[];
}

export interface SaleRequest {
    customerId: number | null;
    tableId: number;
    details: SaleDetailRequest[] | null;
}

export type Period = "ALL" | "TODAY" | "YESTERDAY" | "7D" | "30D" | "DATE";