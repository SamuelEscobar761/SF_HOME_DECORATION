import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sell" element={<HomePage />} />
            <Route path="/inventory" element={<HomePage />} />
            <Route path="/replenishment" element={<HomePage />} />
            <Route path="/users" element={<HomePage />} />
        </Routes>
    );
}