import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Products from "./pages/Products";
import Home from "./pages/Home";


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

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;