import { Fragment, useState } from "react";
import type { Sale } from "../../types/Sales";
import "./SalesTable.css";

interface Props {
    sales: Sale[];
}

export default function SalesTable({ sales }: Props) {
    const [expandedSale, setExpandedSale] = useState<number | null>(null);

    return (
        <div className="sales-table-container">
            <table className="data-table sales-table">
                <thead>
                    <tr>
                        <th>Sale</th>
                        <th>Table</th>
                        <th>Date</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map(sale => {
                        const details = sale.details ?? [];

                        return (
                            <Fragment key={sale.id}>
                                <tr className="sale-main-row">
                                    <td className="product-name">
                                        #{sale.id}
                                    </td>

                                    <td>{sale.tableId}</td>

                                    <td>
                                        {new Date(
                                            sale.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>{details.length}</td>

                                    <td>
                                        ${sale.total.toFixed(2)}
                                    </td>

                                    <td>
                                        <span
                                            className={`status-badge ${sale.status.toLowerCase()}`}
                                        >
                                            {sale.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="details-toggle"
                                            onClick={() =>
                                                setExpandedSale(
                                                    expandedSale === sale.id
                                                        ? null
                                                        : sale.id
                                                )
                                            }
                                        >
                                            {expandedSale === sale.id
                                                ? "Hide"
                                                : "View"}

                                            <span>
                                                {expandedSale === sale.id
                                                    ? "⌃"
                                                    : "⌄"}
                                            </span>
                                        </button>
                                    </td>
                                </tr>

                                {expandedSale === sale.id && (
                                    <tr className="sale-expanded-row">
                                        <td colSpan={7}>
                                            <div className="sale-expanded-content">

                                                <div className="sale-expanded-header">
                                                    <div>
                                                        <strong>
                                                            Order #{sale.id}
                                                        </strong>

                                                        <span>
                                                            {new Date(
                                                                sale.createdAt
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <span>
                                                        {details.length} products
                                                    </span>
                                                </div>

                                                {details.length > 0 ? (
                                                    <div className="sale-items">

                                                        <div className="sale-items-heading">
                                                            <span>Product</span>
                                                            <span>Quantity</span>
                                                            <span>Unit Price</span>
                                                            <span>Subtotal</span>
                                                        </div>

                                                        {details.map(detail => (
                                                            <div
                                                                className="sale-item"
                                                                key={detail.id}
                                                            >
                                                                <strong className="sale-item-name">
                                                                    {detail.productName?.trim() ||
                                                                        `Product #${detail.productId}`}
                                                                </strong>

                                                                <span>
                                                                    {detail.quantity}
                                                                </span>

                                                                <span>
                                                                    ${detail.unitPrice.toFixed(2)}
                                                                </span>

                                                                <strong>
                                                                    ${detail.subtotal.toFixed(2)}
                                                                </strong>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="empty-sale-details">
                                                        This sale has no products.
                                                    </p>
                                                )}

                                                <div className="sale-expanded-total">
                                                    <span>Order total</span>
                                                    <strong>
                                                        ${sale.total.toFixed(2)}
                                                    </strong>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}