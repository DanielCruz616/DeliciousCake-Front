import type { Product } from "../types/Product";

export async function createProduct(product: Omit<Product, "id">) {
    const response = await fetch("http://localhost:8080/products", {
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
    const response = await fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
}

export async function updateProduct(product: Product) {
    const response = await fetch(
        `http://localhost:8080/products/${product.id}`,
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