import { useEffect, useState } from "react";
import type { Category } from "../../types/Category";
import { createProduct, updateProduct } from "../../services/productService";
import "./ProductModal.css";
import type { Product } from "../../types/Product";

interface ProductModalProps {
    categories: Category[];
    open: boolean;
    onClose: () => void;
    product?: Product;
}

export default function ProductModal({ categories, open, onClose, product }: ProductModalProps) {

    const [name, setName] = useState(product?.name ?? "");
    const [price, setPrice] = useState(product?.price.toString() ?? "");
    const [categoryId, setCategoryId] = useState(product?.categoryId.toString() ?? "");
    const [description, setDescription] = useState(product?.description ?? "");
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            name,
            price: Number(price),
            categoryId: Number(categoryId),
            description
        };

        try {
            if (product) {
                await updateProduct({
                    id: product.id,
                    ...data
                });
            } else {
                await createProduct(data);
            }

            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setName(product?.name ?? "");
        setPrice(product?.price.toString() ?? "");
        setCategoryId(product?.categoryId.toString() ?? "");
        setDescription(product?.description ?? "");
    }, [product, open]);

    return (
        open && (
            <div className="modal-overlay">
                <div className="modal">
                    <button
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>

                    <h2>{product ? "Edit Product" : "Add Product"}</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select category</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button type="submit">
                                {product ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
}