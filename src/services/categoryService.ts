import type { Category } from "../types/Category";

export async function createCategory(category: Omit<Category, "id">) {
    const response = await fetch("http://localhost:8080/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });

    if (!response.ok) {
        throw new Error("Failed to create category");
    }

    return response.json();
}