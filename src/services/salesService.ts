import type { Sale, SaleRequest } from "../types/Sales";

const API_URL = "http://localhost:8080/sales";

export async function getOpenSales(): Promise<Sale[]> {

    const response = await fetch(`${API_URL}/open`);
    if (!response.ok) {
        throw new Error("Error fetching open sales");
    }
    return response.json();
}

export async function paySale(id: number): Promise<Sale> {
    const response = await fetch(`${API_URL}/${id}/pay`, {
        method: "PUT"
    });

    if (!response.ok) throw new Error("Error paying sale");

    return response.json();
}

export async function cancelSale(id: number): Promise<Sale> {
    const response = await fetch(`${API_URL}/${id}/cancel`, {
        method: "PUT"
    });

    if (!response.ok) throw new Error("Error cancelling sale");

    return response.json();
}

export async function createSale(sale: SaleRequest): Promise<Sale> {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sale)
    });
    if (!response.ok) {
        throw new Error("Error creating sale");
    }
    return response.json();
}

export async function updateSale(id: number, sale: SaleRequest): Promise<Sale> {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sale)
    });
    if (!response.ok) {
        throw new Error("Error updating sale");
    }
    return response.json();
}