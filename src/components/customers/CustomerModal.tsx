import { useState } from "react";
import { createCustomer } from "../../services/customerService";
import type { Customer } from "../../types/Customer";
import "../products/ProductModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (customer: Customer) => void;
}

export default function CustomerModal({
    open,
    onClose,
    onCreated
}: Props) {
    const [cc, setCc] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    if (!open) return null;

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        const customer = await createCustomer({
            cc: Number(cc),
            name,
            lastName,
            email
        });

        onCreated(customer);

        setCc("");
        setName("");
        setLastName("");
        setEmail("");

        onClose();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>New Customer</h2>

                <form onSubmit={handleSubmit}>

                    <label>CC</label>
                    <input
                        type="number"
                        value={cc}
                        onChange={(event) =>
                            setCc(event.target.value)
                        }
                        required
                    />

                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />

                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(event) =>
                            setLastName(event.target.value)
                        }
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Create Customer
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}