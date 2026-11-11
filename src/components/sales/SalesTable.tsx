import type { Sale } from "../../types/Sales";
import "../shared/DataTable.css";

interface Props {
    sales: Sale[];
    onViewDetails: (sale: Sale) => void;
}

export default function SalesTable({ sales, onViewDetails }: Props) {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Sale ID</th>
                    <th>Table</th>
                    <th>Date</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Details</th>
                </tr>
            </thead>

            <tbody>
                {sales.map(sale => (
                    <tr key={sale.id}>
                        <td className="product-name">#{sale.id}</td>
                        <td>{sale.tableId}</td>
                        <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td>{sale.details.length}</td>
                        <td>${sale.total.toFixed(2)}</td>
                        <td>
                            <span className="category-badge">
                                {sale.status}
                            </span>
                        </td>
                        <td>
                            <button
                                className="edit-button"
                                onClick={() => onViewDetails(sale)}
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}