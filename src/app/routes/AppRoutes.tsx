import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { SellPage } from "../pages/SellPage";
import { InventoryPage } from "../pages/InventoryPage";
import { ProvidersPage } from "../pages/ProvidersPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/replenishment" element={<ProvidersPage />} />
            <Route path="/users" element={<HomePage />} />
        </Routes>
    );
}