import { useEffect, useState } from "react";
import SalesTable from "../components/sales/SalesTable";
import type { Sale } from "../types/Sales";
import "./Details.css";

export default function Details() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/sales")
            .then(async response => {
                if (!response.ok) throw new Error("Failed to load sales");
                setSales(await response.json());
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = sales
        .filter(sale => sale.status === "PAID")
        .reduce((sum, sale) => sum + sale.total, 0);

    return (
        <main className="details-page">
            <header className="details-heading">
                <div>
                    <span className="details-subtitle">PASTRY SHOP MANAGEMENT</span>
                    <h1>Sales Details</h1>
                    <p>Review your sales history and order information.</p>
                </div>

                <div className="details-summary">
                    <span>Total Revenue</span>
                    <strong>${totalRevenue.toFixed(2)}</strong>
                </div>
            </header>

            <section className="details-panel">
                <div className="details-section-heading">
                    <div>
                        <h2>Sales History</h2>
                        <p>All your registered sales and their details.</p>
                    </div>

                    <span className="sales-count">
                        {sales.length} Sales
                    </span>
                </div>

                <div className="details-content">
                    {loading && <div className="overlay">Loading...</div>}

                    {error && (
                        <div className="overlay">
                            <p>Could not load sales.</p>
                            <button onClick={() => window.location.reload()}>
                                Try again
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <SalesTable sales={sales} />
                    )}
                </div>
            </section>
        </main>
    );
}