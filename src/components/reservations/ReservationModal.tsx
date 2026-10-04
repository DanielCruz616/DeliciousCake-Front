import { useEffect, useState } from "react";
import type { Customer } from "../../types/Customer";
import { createReservation, updateReservation } from "../../services/reservationService";
import "../products/ProductModal.css";
import type { Reservation } from "../../types/Reservation";
import CustomerModal from "../customers/CustomerModal";

interface Props {
    open: boolean;
    onClose: () => void;
    customers: Customer[];
    defaultDate: Date;
    reservation?: Reservation | null;
}

export default function ReservationModal({ open, onClose, customers, defaultDate, reservation }: Props) {
    const [search, setSearch] = useState("");
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [pickupAt, setPickupAt] = useState("");
    const [total, setTotal] = useState("");
    const [pending, setPending] = useState("");
    const [description, setDescription] = useState("");
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (reservation) {
            setCustomer(
                customers.find(
                    (item) => item.id === reservation.customerId
                ) ?? null
            );

            setPickupAt(reservation.pickupAt);
            setTotal(String(reservation.total));
            setPending(String(reservation.pending));
            setDescription(reservation.description);
        } else {
            setCustomer(null);
            setSearch("");
            setTotal("");
            setPending("");
            setDescription("");
            setPickupAt(formatDate(defaultDate));
        }
    }, [open, reservation, customers, defaultDate]);

    if (!open) return null;

    const results = customers.filter((customer) => {
        const name =
            `${customer.name} ${customer.lastName}`.toLowerCase();

        return (
            name.includes(search.toLowerCase()) ||
            String(customer.cc).includes(search)
        );
    });

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!customer) {
            alert("Select a customer");
            return;
        }

        const data = {
            customerId: customer.id,
            pickupAt,
            total: Number(total),
            pending: Number(pending),
            description
        };

        if (reservation) {
            await updateReservation(
                reservation.id,
                data
            );
        } else {
            await createReservation(data);
        }

        onClose();
        window.location.reload();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>{reservation ? "Edit Reservation" : "Add Reservation"}</h2>

                <form onSubmit={handleSubmit}>

                    <label>Customer</label>

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
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
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
                                            {item.name} {item.lastName}
                                            {" — "}
                                            {item.cc}
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
                        onChange={(event) =>
                            setPickupAt(event.target.value)
                        }
                        required
                    />

                    <label>Total</label>

                    <input
                        type="number"
                        min="0"
                        value={total}
                        onChange={(event) =>
                            setTotal(event.target.value)
                        }
                        required
                    />

                    <label>Pending</label>

                    <input
                        type="number"
                        min="0"
                        value={pending}
                        onChange={(event) =>
                            setPending(event.target.value)
                        }
                        required
                    />

                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />

                    <div className="reservation-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            {reservation ? "Update Reservation" : "Add Reservation"}
                        </button>
                    </div>

                </form>

            </div>
            <CustomerModal
                open={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onCreated={(newCustomer) => {
                    setCustomer(newCustomer);
                }}
            />
        </div>

    );
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}