import SalesTable from "../sales/SalesTable";
import type { Sale } from "../../types/Sales";

interface Props {
    sales: Sale[];
    loading: boolean;
    error: string;
    search: string;
    status: string;
    currentPage: number;
    totalPages: number;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPageChange: (page: number) => void;
}

export default function SalesHistory({
    sales,
    loading,
    error,
    search,
    status,
    currentPage,
    totalPages,
    onSearchChange,
    onStatusChange,
    onPageChange
}: Props) {
    return (
        <section className="details-panel">
            <div className="details-section-heading">
                <div>
                    <h2>Sales History</h2>
                    <p>
                        All your registered sales and their details.
                    </p>
                </div>

                <span className="sales-count">
                    {sales.length} Sales
                </span>
            </div>

            <div className="details-toolbar">
                <input
                    type="search"
                    placeholder="Search by sale ID..."
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                />

                <select
                    value={status}
                    onChange={e => onStatusChange(e.target.value)}
                >
                    <option value="ALL">All statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="PAID">Paid</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div className="details-content">
                {loading && (
                    <div className="overlay">
                        Loading...
                    </div>
                )}

                {error && (
                    <div className="overlay">
                        <p>Could not load sales.</p>
                        <button onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {sales.length > 0 ? (
                            <SalesTable sales={sales} />
                        ) : (
                            <p className="empty-sales">
                                No sales found.
                            </p>
                        )}

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => onPageChange(currentPage - 1)}
                                >
                                    Previous
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map(page => (
                                    <button
                                        key={page}
                                        className={
                                            currentPage === page ? "active" : ""
                                        }
                                        onClick={() => onPageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => onPageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}