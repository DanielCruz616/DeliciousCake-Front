import type { Product } from "../../types/Product";
import type { Category } from "../../types/Category";
import { deleteProduct } from "../../services/productService";
import "./ProductTable.css";

interface ProductTableProps {
    products: Product[];
    categories: Category[];
    onEdit?: (product: Product) => void;
}

export default function ProductTable({ products, categories, onEdit }: ProductTableProps) {
    const handleDelete = async (id: number) => {
        const confirmation = window.prompt(
            'Type "BORRAR" to delete this product:'
        );

        if (confirmation !== "BORRAR") {
            return;
        }

        try {
            await deleteProduct(id);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="product-name">{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.description}</td>
                        <td>
                            <span className="category-badge">
                                {categories.find(
                                    (category) =>
                                        category.id === product.categoryId
                                )?.name ?? "Unknown"}
                            </span>
                        </td>
                        <td>
                            <div className="actions">
                                <button className="edit-button" onClick={() => onEdit?.(product)}>
                                    Edit
                                </button>

                                <button className="delete-button" onClick={() => handleDelete(product.id)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}