import {Link} from "react-router-dom";
import "./SideBar.css";

export default function SideBar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">  
                <img src="../../../../public/logo.png" alt="Company Logo" />
            </div>
            <nav className="sidebar-nav">
                <Link to="/">Dashboard</Link>
                <Link to ="/products">Products</Link>
                <Link to="/sales">Tables</Link>
                <Link to="/reservations">Reservation</Link>
                <Link to="/details">Details</Link>
            </nav>
        </aside>
        
    )
}