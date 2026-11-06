import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/Product";
import "../products/ProductModal.css"

interface Props {
    table: number | null;
    open: boolean;
    onClose: () => void;
}

interface SubsaleProduct {
    product: Product;
    quantity: number;
}

export default function TableModal({ table, open, onClose }: Props) {

    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [subsale, setSubsale] = useState<SubsaleProduct[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!open) return;

        getProducts()
            .then(setProducts)
            .catch(console.error);
    }, [open]);

    if (!open) return null;

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    function addProduct(product: Product) {
        const quantity = quantities[product.id] || 1;

        setSubsale((current) => {
            const existing = current.find(
                (item) => item.product.id === product.id
            );

            if (existing) {
                return current.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...current, { product, quantity }];
        });

        setQuantities((current) => ({
            ...current,
            [product.id]: 1
        }));
    }

    function removeProduct(productId: number) {
        setSubsale((current) =>
            current.filter((item) => item.product.id !== productId)
        );
    }

    const total = subsale.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>
                    X
                </button>

                <h2>Mesa {table}</h2>

                <h3>Productos</h3>

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {filteredProducts.map((product) => (
                    <div key={product.id}>
                        <span>
                            {product.name} - ${product.price}
                        </span>

                        <input
                            type="number"
                            min="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) =>
                                setQuantities((current) => ({
                                    ...current,
                                    [product.id]: Math.max(
                                        1,
                                        Number(e.target.value)
                                    )
                                }))
                            }
                        />

                        <button
                            type="button"
                            onClick={() => addProduct(product)}
                        >
                            Agregar
                        </button>
                    </div>
                ))}

                <h3>Productos de la venta</h3>

                {subsale.map((item) => (
                    <div key={item.product.id}>
                        <span>
                            {item.product.name} x {item.quantity}
                            {" - $"}
                            {item.product.price * item.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() => removeProduct(item.product.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <h3>Total: ${total}</h3>

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>

                    <button
                        type="button"
                        disabled={subsale.length === 0}
                        onClick={() => {
                            console.log("Table:", table, "Subsale:", subsale);
                        }}
                    >
                        Guardar venta
                    </button>
                </div>
            </div>
        </div>
    );
}
