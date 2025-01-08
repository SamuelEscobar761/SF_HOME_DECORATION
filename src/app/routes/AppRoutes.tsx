import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { SellPage } from "../pages/SellPage";
import { InventoryPage } from "../pages/InventoryPage";
import { ProvidersPage } from "../pages/ProvidersPage";
import { UsersPage } from "../pages/UsersPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/replenishment" element={<ProvidersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/shopping_cart" element={<ShoppingCartPage />} />
        </Routes>
    );
}