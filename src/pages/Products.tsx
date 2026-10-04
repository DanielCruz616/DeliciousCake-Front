import { useEffect, useState } from "react";
import ProductTable from "../components/products/ProductTable";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";
import "./Products.css";
import "../components/products/ProductModal.css";
import ProductModal from "../components/products/ProductModal";
import CategoryModal from "../components/categories/CategoryModal";



export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );


    useEffect(() => {
        Promise.all([
            fetch("http://localhost:8080/products"),
            fetch("http://localhost:8080/categories")
        ])
            .then(async ([productsResponse, categoriesResponse]) => {
                if (!productsResponse.ok || !categoriesResponse.ok) {
                    throw new Error("Failed to load data");
                }

                const products = await productsResponse.json();
                const categories = await categoriesResponse.json();

                setProducts(products);
                setCategories(categories);
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="products-page">

            <header className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your delicious products</p>
                </div>

                <button onClick={() => {
                    setEditingProduct(undefined);
                    setShowProductModal(true);
                }}>
                    + Add Product
                </button>
                <button onClick={() => {setShowCategoryModal(true);}}>
                    + Add Category
                </button>
            </header>

            <div className="products-toolbar">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="view-buttons">
                    <label>
                        <input
                            type="radio"
                            name="view"
                            value="products"
                            defaultChecked
                        />
                        Products
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="view"
                            value="categories"
                        />
                        Categories
                    </label>
                </div>
            </div>

            <div className="products-content">
                {loading && <div className="overlay">Loading...</div>}

                {error && (
                    <div className="overlay">
                        <p>Could not load products.</p>
                        <button onClick={() => window.location.reload()}>
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <ProductTable products={filteredProducts} categories={categories} onEdit={(product) => {
                        setEditingProduct(product);
                        setShowProductModal(true);
                    }} />
                )}
            </div>

            <ProductModal
                categories={categories}
                open={showProductModal}
                product={editingProduct}
                onClose={() => setShowProductModal(false)}
            />
            <CategoryModal
                open={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
            />
        </div>
    );
}