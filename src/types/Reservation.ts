export interface Reservation {
    id: number;
    createdAt: string;
    description: string;
    pending: number;
    pickupAt: string;
    total: number;
    customerId: number;
}