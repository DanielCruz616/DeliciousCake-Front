
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Customer } from "../../types/Customer";
import type { Reservation } from "../../types/Reservation";
import {
    createReservation,
    updateReservation,
    type CreateReservationData,
} from "../../services/reservationService";
import CustomerModal from "../customers/CustomerModal";
import "../products/ProductModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    onSaved: () => void | Promise<void>;
    customers: Customer[];
    defaultDate: Date;
    reservation?: Reservation | null;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function ReservationModal({
    open,
    onClose,
    onSaved,
    customers,
    defaultDate,
    reservation,
}: Props) {
    const [search, setSearch] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [pickupAt, setPickupAt] = useState("");
    const [total, setTotal] = useState("");
    const [pending, setPending] = useState("");
    const [description, setDescription] = useState("");
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        setCustomer(
            reservation
                ? customers.find(({ id }) => id === reservation.customerId) ?? null
                : null
        );
        setSearch("");
        setPickupAt(
            reservation?.pickupAt ?? formatDate(defaultDate)
        );
        setTotal(reservation ? String(reservation.total) : "");
        setPending(reservation ? String(reservation.pending) : "");
        setDescription(reservation?.description ?? "");
        setError("");
    }, [open, reservation, customers, defaultDate]);

    if (!open) return null;

    const results = customers.filter(({ name, lastName, cc }) => {
        const query = search.toLowerCase();

        return (
            `${name} ${lastName}`.toLowerCase().includes(query) ||
            String(cc).includes(search)
        );
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (saving) return;

        if (!customer) {
            setError("Please select a customer.");
            return;
        }

        const data: CreateReservationData = {
            customerId: customer.id,
            pickupAt,
            total: Number(total),
            pending: Number(pending),
            description,
        };

        setSaving(true);
        setError("");

        try {
            if (reservation) {
                await updateReservation(reservation.id, data);
            } else {
                await createReservation(data);
            }

            await onSaved();
            onClose();
        } catch (err) {
            console.error("Failed to save reservation:", err);
            setError("Could not save the reservation. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{reservation ? "Edit Reservation" : "Add Reservation"}</h2>

                <form onSubmit={handleSubmit}>
                    <label>Customer</label>

                    {customer ? (
                        <div className="selected-customer">
                            <span>
                                {customer.name} {customer.lastName}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCustomer(null)}
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="search"
                                placeholder="Search by name or CC..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            {search && (
                                <div className="customer-results">
                                    {results.map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => {
                                                setCustomer(item);
                                                setSearch("");
                                            }}
                                        >
                                            {item.name} {item.lastName} — {item.cc}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                className="new-customer-button"
                                onClick={() => setShowCustomerModal(true)}
                            >
                                + Create New Customer
                            </button>
                        </>
                    )}

                    <label>Pickup date</label>
                    <input
                        type="date"
                        value={pickupAt}
                        onChange={(event) => setPickupAt(event.target.value)}
                        required
                    />

                    <label>Total</label>
                    <input
                        type="number"
                        min="0"
                        value={total}
                        onChange={(event) => setTotal(event.target.value)}
                        required
                    />

                    <label>Pending</label>
                    <input
                        type="number"
                        min="0"
                        value={pending}
                        onChange={(event) => setPending(event.target.value)}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />

                    {error && <p role="alert">{error}</p>}

                    <div className="reservation-modal-actions">
                        <button type="button" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : reservation
                                  ? "Update Reservation"
                                  : "Add Reservation"}
                        </button>
                    </div>
                </form>
            </div>

            <CustomerModal
                open={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onCreated={(newCustomer) => {
                    setCustomer(newCustomer);
                    setShowCustomerModal(false);
                }}
            />
        </div>
    );
}
