import type { Sale } from "../../types/Sales";
import "./SalesTable.css";

interface Props {
    sales: Sale[];
}

export default function SalesTable({ sales }: Props) {
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
                </tr>
            </thead>

            <tbody>
                {sales.map(sale => (
                    <>
                        <tr key={sale.id}>
                            <td>#{sale.id}</td>
                            <td>{sale.tableId}</td>
                            <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                            <td>{sale.details.length}</td>
                            <td>${sale.total.toFixed(2)}</td>
                            <td>
                                <span className="category-badge">
                                    {sale.status}
                                </span>
                            </td>
                        </tr>

                        <tr key={`${sale.id}-details`}>
                            <td colSpan={6}>
                                {sale.details.map(detail => (
                                    <div key={detail.id}>
                                        {detail.productName} — {detail.quantity} x
                                        ${detail.unitPrice.toFixed(2)}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </>
                ))}
            </tbody>
        </table>
    );
}