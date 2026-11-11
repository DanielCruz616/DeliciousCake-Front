import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { createSale, updateSale, paySale, cancelSale } from "../../services/salesService";

import type { Product } from "../../types/Product";
import type { Sale, SaleDetailRequest } from "../../types/Sales";

import ProductCard from "../products/ProductCard";
import "./TableModal.css";

interface Props {
    table: number | null;
    open: boolean;
    sale: Sale | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function TableModal({ table, open, sale, onClose, onSaved }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [details, setDetails] = useState<SaleDetailRequest[]>([]);
    const [saleId, setSaleId] = useState<number | null>(sale?.id ?? null);
    const [search, setSearch] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        getProducts().then(setProducts).catch(console.error);
        setSaleId(sale?.id ?? null);
        setDetails(sale?.details.map(({ productId, quantity }) => ({ productId, quantity })) ?? []);
        setSearch("");
        setConfirmation("");
    }, [open, sale]);

    if (!open || table === null) return null;

    const tableId = table;
    const productMap = new Map(products.map(product => [product.id, product]));
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const quantities = Object.fromEntries(details.map(({ productId, quantity }) => [productId, quantity]));
    const total = details.reduce((sum, detail) =>
        sum + (productMap.get(detail.productId)?.price ?? 0) * detail.quantity, 0
    );

    function updateProduct(productId: number, quantity: number) {
        setDetails(current => {
            const existing = current.find(detail => detail.productId === productId);

            if (quantity <= 0) {
                return current.filter(detail => detail.productId !== productId);
            }

            return existing
                ? current.map(detail => detail.productId === productId ? { ...detail, quantity } : detail)
                : [...current, { productId, quantity }];
        });
    }

    async function save(): Promise<number> {
        const request = { customerId: sale?.customerId ?? null, tableId, details };

        const result = saleId
            ? await updateSale(saleId, request)
            : await createSale(request);

        setSaleId(result.id);
        return result.id;
    }

    async function execute(action: () => Promise<void>) {
        try {
            setSaving(true);
            await action();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="table-overlay">
            <div className="table">
                <div className="table-information">
                    <div className="table-header">
                    <h2>Mesa {table}</h2>
                    <button className="table-close-button" onClick={() => execute(async () => { await save(); onSaved(); onClose() })}>X</button>
                    </div>
                    <h3>Productos</h3>

                    <input
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <div className="filtered-products">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                quantity={quantities[product.id] ?? 0}
                                onQuantityChange={quantity => updateProduct(product.id, quantity)}
                            />
                        ))}
                    </div>
                </div>
                <div className="table-confirmation">

                    <div className="receipt-header">
                        <div>
                            <small>Order No.</small>
                            <strong>#{saleId ?? "New Order"}</strong>
                        </div>

                        <div>
                            <small>Table No.</small>
                            <strong>{table}</strong>
                        </div>
                    </div>

                    <div className="receipt-products">
                        {details.map(detail => {
                            const product = productMap.get(detail.productId);
                            if (!product) return null;

                            return (
                                <div className="receipt-item" key={detail.productId}>
                                    <div className="receipt-item-info">
                                        <strong>{detail.quantity}x</strong>
                                        <span>{product.name}</span>
                                    </div>

                                    <strong>
                                        ${(product.price * detail.quantity).toFixed(2)}
                                    </strong>
                                </div>
                            );
                        })}
                    </div>

                        <div className="receipt-total">
                            <strong>Total</strong>
                            <strong>${total}</strong>
                        </div>
                   

                    <div className="receipt-actions">

                        {saleId && (
                            <div className="cancel-section">
                                <input
                                    placeholder="Type cancel to confirm"
                                    value={confirmation}
                                    onChange={e => setConfirmation(e.target.value)}
                                />

                                <button
                                    className="cancel-button"
                                    disabled={saving || confirmation.trim().toLowerCase() !== "cancel"}
                                    onClick={() => execute(async () => {
                                        await cancelSale(saleId);
                                        onSaved();
                                        onClose();
                                    })}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <button
                            className="pay-button"
                            disabled={saving || details.length === 0}
                            onClick={() => execute(async () => {
                                const id = await save();
                                await paySale(id);
                                onSaved();
                                onClose();
                            })}
                        >
                            Take Payment
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}