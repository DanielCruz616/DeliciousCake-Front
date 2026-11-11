import type { Product } from "../../types/Product";
import "./ProductCard.css";

interface ProductCardProps {
    product: Product;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

export default function ProductCard({
    product,
    quantity,
    onQuantityChange
}: ProductCardProps) {

    return (
        <div className="product-card">

            <img
                className="product-image"
                // src={product.imageUrl}
                alt={product.name}
            />

            <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
            </div>

            <div className="product-footer">
                <strong>${product.price}</strong>

                {quantity === 0 ? (
                    <button
                        className="add-product"
                        onClick={() => onQuantityChange(1)}
                    >
                        + Agregar
                    </button>
                ) : (
                    <div className="product-actions">

                        <button className="minus-button"
                            onClick={() => onQuantityChange(quantity - 1)}
                        >
                            −
                        </button>

                        <span>{quantity}</span>

                        <button className="plus-button" 
                            onClick={() => onQuantityChange(quantity + 1)}
                        >
                            +
                        </button>

                    </div>
                )}
            </div>

        </div>
    );
}