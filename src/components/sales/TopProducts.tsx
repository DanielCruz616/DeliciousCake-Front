export interface ProductSummary {
    id: number;
    name: string;
    quantity: number;
}

interface Props {
    products: ProductSummary[];
}

export default function TopProducts({ products }: Props) {
    const maxQuantity = Math.max(
        ...products.map(product => product.quantity),
        1
    );

    return (
        <div className="statistics-panel">
            <div className="statistics-panel-heading">
                <div>
                    <h2>Most Common Products</h2>
                    <p>Ranked by units sold</p>
                </div>

                <span>Top 5</span>
            </div>

            {products.length > 0 ? (
                <div className="top-products">
                    {products.map(product => (
                        <div
                            className="top-product"
                            key={product.id}
                        >
                            <div className="top-product-info">
                                <span>{product.name}</span>
                                <strong>{product.quantity} sold</strong>
                            </div>

                            <div className="product-chart-track">
                                <div
                                    className="product-chart-bar"
                                    style={{
                                        width: `${product.quantity / maxQuantity * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="empty-statistics">
                    No paid product sales for this period.
                </p>
            )}
        </div>
    );
}