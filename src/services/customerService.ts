import type { Customer } from "../types/Customer";

export async function getCustomers(): Promise<Customer[]> {
    const response = await fetch("http://localhost:8080/customers");

    if (!response.ok) {
        throw new Error("Failed to load customers");
    }

    return response.json();
}

export async function createCustomer( customer: Omit<Customer, "id">) {
    const response = await fetch(
        "http://localhost:8080/customers",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create customer");
    }

    return response.json();
}