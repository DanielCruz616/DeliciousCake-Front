import { useEffect, useState } from "react";
import ProductTable from "../components/products/ProductTable";
import type { Product } from "../types/Product";

export default function Inventory() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] =useState("");
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetch("http://localhost:8080/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                return response.json();
            })
            .then((data: Product[]) => {
                setProducts(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="products-page">

            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your delicious products</p>
                </div>

                <form className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search for products..." 
                        className="search-input" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
            </div>
            
            <ProductTable products={filteredProducts} />

        </div>
    );
}