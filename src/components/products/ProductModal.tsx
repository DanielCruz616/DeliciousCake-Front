import { useEffect, useState } from "react";

import type { Category } from "../../types/Category";
import type { Product } from "../../types/Product";

import {
    createProduct,
    updateProduct,
    uploadProductImage
} from "../../services/productService";

import "./ProductModal.css";

interface ProductModalProps {
    categories: Category[];
    open: boolean;
    onClose: () => void;
    product?: Product;
}

export default function ProductModal({
    categories,
    open,
    onClose,
    product
}: ProductModalProps) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(product?.name ?? "");
        setPrice(product?.price.toString() ?? "");
        setCategoryId(product?.categoryId.toString() ?? "");
        setDescription(product?.description ?? "");

        setImage(null);
        setPreview(null);

    }, [product, open]);

    useEffect(() => {
        if (!image) return;

        const imageUrl = URL.createObjectURL(image);

        setPreview(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);

    }, [image]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image cannot exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setImage(file);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (loading) return;

        setLoading(true);

        const data = {
            name,
            price: Number(price),
            categoryId: Number(categoryId),
            description,
            imageUrl: product?.imageUrl ?? null
        };

        try {

            let savedProduct: Product;

            if (product) {

                savedProduct = await updateProduct({
                    id: product.id,
                    ...data
                });

            } else {

                savedProduct = await createProduct(data);

            }

            if (image) {
                await uploadProductImage(savedProduct.id, image);
            }

            onClose();
            window.location.reload();

        } catch (error) {

            console.error(error);
            alert("Could not save the product.");

        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const currentImage = preview ??
        (product?.imageUrl
            ? `http://localhost:8080${product.imageUrl}`
            : null);

    return (
        <div className="modal-overlay">

            <div className="modal">

                <button
                    className="close-button"
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                >
                    ×
                </button>

                <h2>
                    {product ? "Edit Product" : "Add Product"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        placeholder="Product name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />

                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Select category</option>

                        {categories.map(category => (
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
                        onChange={e => setDescription(e.target.value)}
                    />

                    {/* Image upload */}

                    <div className="product-image-upload">

                        <label htmlFor="product-image">
                            Product Image
                        </label>

                        <input
                            id="product-image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                        />

                        {currentImage && (
                            <div className="aimage-preview">
                                <img className="image-preview"
                                    src={currentImage}
                                    alt="Product preview"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setPreview(null);
                                    }}
                                >
                                    Remove selection
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : product
                                    ? "Update Product"
                                    : "Add Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}