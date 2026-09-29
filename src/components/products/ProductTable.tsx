import type {Product} from "../../types/Product";

interface ProductTableProps{
    products: Product[];
}

export default function ProductTable({products} : ProductTableProps){
    return(
        <table> 
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.description}</td>
                        <td>{product.categoryId}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}