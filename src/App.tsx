import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Products from "./pages/Products";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";
import Sales from "./pages/Sales";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<DashboardLayout />}>

                    <Route 
                        path="/" 
                        element={<Home />} 
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route 
                        path="/reservations"
                        element={<Reservations />}
                    />

                    <Route 
                        path="/sales"
                        element={<Sales />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;