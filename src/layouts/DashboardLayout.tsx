import Sidebar from "../components/layout/SideBar";
import {Outlet} from "react-router-dom";
import "./DashboardLayout.css";

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}