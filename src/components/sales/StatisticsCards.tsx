interface Props {
    paidSales: number;
    averageSale: number;
    productsSold: number;
    totalSales: number;
}

export default function StatisticsCards({
    paidSales,
    averageSale,
    productsSold,
    totalSales
}: Props) {
    return (
        <section className="statistics-grid">
            <div className="stat-card">
                <span>Paid Sales</span>
                <strong>{paidSales}</strong>
                <small>Completed orders</small>
            </div>

            <div className="stat-card">
                <span>Average Sale</span>
                <strong>${averageSale.toFixed(2)}</strong>
                <small>Per paid order</small>
            </div>

            <div className="stat-card">
                <span>Total Products Sold</span>
                <strong>{productsSold}</strong>
                <small>Units sold</small>
            </div>

            <div className="stat-card">
                <span>All Sales</span>
                <strong>{totalSales}</strong>
                <small>Including open and cancelled</small>
            </div>
        </section>
    );
}