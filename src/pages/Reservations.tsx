import { useEffect, useState } from "react";
import ReservationCalendar from "../components/reservations/ReservationCalendar";
import ReservationModal from "../components/reservations/ReservationModal";
import { getCustomers } from "../services/customerService";
import { deleteReservation, getReservations } from "../services/reservationService";
import type { Customer } from "../types/Customer";
import type { Reservation } from "../types/Reservation";
import CustomerModal from "../components/customers/CustomerModal";
import "./Reservations.css";

export default function Reservations() {
    const [date, setDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const selectedReservations = reservations.filter(
        (reservation) =>
            reservation.pickupAt === formatDate(date)
    );
    const createdReservations = [...reservations].sort(
        (a, b) =>
            parseDate(b.createdAt).getTime() -
            parseDate(a.createdAt).getTime()
    );
    const getCustomer = (id: number) => customers.find((customer) => customer.id === id);

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this reservation?")) {
            return;
        }

        await deleteReservation(id);

        window.location.reload();
    }

    useEffect(() => {
        Promise.all([
            getReservations(),
            getCustomers()
        ]).then(([reservations, customers]) => {
            setReservations(reservations);
            setCustomers(customers);
        });
    }, []);


    return (
        <div className="reservations-page">

            <header className="reservations-header">
                <div>
                    <h1>Reservations</h1>
                    <p>Manage your customer reservations</p>
                </div>
                <div className="reservations-header-actions">
                    <button onClick={() => setShowCustomerModal(true)}>
                        + Add Customer
                    </button>
                    <button onClick={() => {
                        setEditingReservation(null);
                        setShowModal(true);
                    }}>
                        + Add Reservation
                    </button>
                </div>
            </header>

            <div className="reservations-content">

                <ReservationCalendar
                    date={date}
                    onDateSelect={setDate}
                />

                <div className="reservations-list">

                    <h2>
                        Reservations for{" "}
                        {formatDisplayDate(date)}
                    </h2>

                    {selectedReservations.length === 0 ? (
                        <p>No reservations for this date.</p>
                    ) : (
                        selectedReservations.map(
                            (reservation) => {
                                const customer =
                                    getCustomer(
                                        reservation.customerId
                                    );

                                return (
                                    <div
                                        className="reservation-item"
                                        key={reservation.id}
                                    >
                                        <div>
                                            <strong>
                                                {customer?.name}{" "}
                                                {customer?.lastName}
                                            </strong>

                                            <p>
                                                {reservation.description}
                                            </p>

                                            <span>
                                                Pending: $
                                                {reservation.pending}
                                            </span>

                                        </div>

                                        <div className="reservation-actions">
                                            <button
                                                onClick={() => {
                                                    setEditingReservation(reservation);
                                                    setShowModal(true);
                                                }
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(reservation.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </div>

            <div className="created-reservations">

                <h2>Recently Created</h2>

                {createdReservations.map(
                    (reservation) => {
                        const customer =
                            getCustomer(
                                reservation.customerId
                            );

                        return (
                            <div
                                className="reservation-item"
                                key={reservation.id}
                            >
                                <strong>
                                    {customer?.name}{" "}
                                    {customer?.lastName}
                                </strong>

                                <span>
                                    Created:{" "}
                                    {formatDisplayDate(
                                        parseDate(
                                            reservation.createdAt
                                        )
                                    )}
                                </span>

                                <span>
                                    Pickup:{" "}
                                    {formatDisplayDate(
                                        parseDate(
                                            reservation.pickupAt
                                        )
                                    )}
                                </span>
                            </div>
                        );
                    }
                )}

            </div>

            <ReservationModal
                open={showModal}
                customers={customers}
                defaultDate={date}
                reservation={editingReservation}
                onClose={() => {
                    setEditingReservation(null);
                    setShowModal(false);
                }}
            />
            <CustomerModal
                open={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onCreated={(customer) => {
                    setCustomers((current) => [
                        ...current,
                        customer
                    ]);
                }}
            />

        </div>
    );
}


/* YYYY-MM-DD without timezone conversion */
function parseDate(value: string): Date {
    const [year, month, day] =
        value.substring(0, 10)
            .split("-")
            .map(Number);

    return new Date(year, month - 1, day);
}


/* Date → YYYY-MM-DD */
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


/* Date → DD/MM/YYYY */
function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}