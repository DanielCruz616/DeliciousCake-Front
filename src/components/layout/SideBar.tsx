import {Link} from "react-router-dom";

export default function SideBar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">  
                <h2>Delicious</h2>
                <span>Cake</span>
            </div>
            

            <nav className="sidebar-nav">
                <Link to="/">Dashboard</Link>
                <Link to ="/products">Products</Link>
                <Link to="/">Tables</Link>
                <Link to="/">Reservation</Link>
                <Link to="/">Details</Link>
            </nav>
        </aside>
        
    )
}