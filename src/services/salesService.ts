import type { Product } from "../types/Product";
import type { Sale } from "../types/Sales"

const API_URL = "http://localhost:8080/sales"

export async function createSale(sale: Omit<Sale, "id">) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sale)
    });
    if (!response.ok) {
        throw new Error("Failed to create the sale")
    }
    return response.json();
}

export async function getOpenSales(): Promise<Sale[]> {
    const response = await fetch(`${API_URL}/open`);
        if (!response.ok) {
        throw new Error("Failed to get product");
    }

    return response.json();
}