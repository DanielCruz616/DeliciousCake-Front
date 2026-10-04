import type { Reservation } from "../types/Reservation";

export type CreateReservationData = {
    customerId: number;
    pickupAt: string;
    pending: number;
    total: number;
    description: string;
};

export async function getReservations(): Promise<Reservation[]> {
    const response = await fetch(
        "http://localhost:8080/reservations"
    );

    if (!response.ok) {
        throw new Error("Failed to load reservations");
    }

    return response.json();
}

export async function createReservation(
    reservation: CreateReservationData
) {
    const response = await fetch(
        "http://localhost:8080/reservations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservation)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create reservation");
    }

    return response.json();
}

export async function updateReservation(
    id: number,
    reservation: CreateReservationData
) {
    const response = await fetch(
        `http://localhost:8080/reservations/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservation)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update reservation");
    }

    return response.json();
}

export async function deleteReservation(id: number) {
    const response = await fetch(
        `http://localhost:8080/reservations/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete reservation");
    }
}