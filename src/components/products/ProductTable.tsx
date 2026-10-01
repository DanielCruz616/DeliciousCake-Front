import type {Product} from "../../types/Product";
import "./ProductTable.css";

interface ProductTableProps{
    products: Product[];
}

export default function ProductTable({products} : ProductTableProps){
    return(
        <table className = "product-table"> 
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
                        <td className = "product-name">{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.description}</td>
                        <td>
                            <span className="category-badge"> 
                                {product.categoryId} 
                            </span>
                        </td>
                        <td className="actions"> 
                            <button className="edit-button"> 
                                Edit 
                            </button> 
                            
                            <button className="delete-button"> 
                                Delete 
                            </button> 
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}