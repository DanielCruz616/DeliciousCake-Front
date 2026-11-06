import type { Product } from "../types/Product";

const API_URL = "http://localhost:8080/products";

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to get product");
    }

    return response.json();
}

export async function createProduct(product: Omit<Product, "id">) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    return response.json();
}

export async function deleteProduct(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
}

export async function updateProduct(product: Product) {
    const response = await fetch(
        `${API_URL}/${product.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update product");
    }

    return response.json();
}