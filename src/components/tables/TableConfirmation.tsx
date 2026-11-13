import { createSale } from "../../services/salesService";
import "../products/ProductModal.css"

interface Props {
    onClose: () => void;
    open: boolean;
    table: number | null;
}

export default function TableConfirmation({ onClose, open, table }: Props) {

    async function handleConfirm() {
        if (table == null) return;
        try {
            await createSale({
                customerId: null,
                tableId: table,
                details: null
            });
        } catch (e) {
            e instanceof Error
                ? e.message
                : "Could not create the sale."
        }
        window.location.reload();
    }

    if (!open) return null;

    return (

        <div className="modal-overlay">
            <div className="modal">
                <h2>Do you want to create a Sale?</h2>
                <div className="modal-actions">
                    <button onClick={onClose}>No</button>
                    <button onClick={handleConfirm}>Yes</button>
                </div>
            </div>
        </div>
    )
}