import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReceiptGenerator from "../pages/receiptgenerator/ReceiptGenerator";
import RecipientsPage from "../pages/recipients/RecipientsPage";
import ItemsPage from "../pages/items/Items";

export default function RootRoutes() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                {/* <header className="md-hidden p-2">
                    <h1 className="hidden md:block font-bold text-lg mr-6">Polar Agencies</h1>
                </header> */}
                <nav className="bg-white shadow p-4 flex justify-between md:justify-center fixed bottom-0 md:static w-full md:w-auto z-50">
                    <h1 className="hidden md:block font-bold text-lg mr-6">Polar Agencies</h1>

                    <div className="flex gap-6 justify-around w-full md:w-auto">
                        <Link to="/recipients" className="text-blue-600 hover:underline">
                            Recipients
                        </Link>
                        <Link to="/items" className="text-blue-600 hover:underline">
                            Items
                        </Link>
                        <Link to="/receipt" className="text-blue-600 hover:underline">
                            Generate
                        </Link>
                    </div>
                </nav>


                {/* Pages */}
                <div className="p-4">
                    <Routes>
                        <Route path="/recipients" element={<RecipientsPage />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/receipt" element={<ReceiptGenerator />} />
                        <Route path="*" element={<RecipientsPage />} /> {/* Default route */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
