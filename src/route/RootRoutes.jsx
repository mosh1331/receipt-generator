import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReceiptGenerator from "../pages/receiptgenerator/ReceiptGenerator";
import RecipientsPage from "../pages/recipients/RecipientsPage";
import ItemsPage from "../pages/items/Items";
import Pending from "../pages/pending/Pending";
import { useSelector } from "react-redux";

export default function RootRoutes() {
    const pendingBills = useSelector((state) => state.pending.list);
    console.log(pendingBills,'pendingBills in routes')

return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                {/* <header className="md-hidden p-2">
                    <h1 className="hidden md:block font-bold text-lg mr-6">Polar Agencies</h1>
                </header> */}
                {/* Desktop Nav */}
                <nav className="hidden md:flex bg-white shadow p-4 justify-center w-full z-50">
                    <h1 className="font-bold text-lg mr-6">Polar Agencies</h1>
                    <div className="flex gap-6">
                        <Link to="/recipients" className="text-blue-600 hover:underline">
                            Recipients
                        </Link>
                        <Link to="/items" className="text-blue-600 hover:underline">
                            Items
                        </Link>
                        <Link to="/receipt" className="text-blue-600 hover:underline">
                            Generate
                        </Link>
                        <Link to="/pending" className="text-blue-600 hover:underline">
                            Pending
                        </Link>
                    </div>
                </nav>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-between items-center px-6 py-2 z-50">
                    {/* Left links */}
                    <Link to="/recipients" className="flex flex-col items-center text-xs text-gray-600">
                        👤
                        <span>Recipients</span>
                    </Link>



                    {/* Floating Button */}
                    <div className="relative -top-6">
                        <Link
                            to="/receipt"
                            className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg text-[32px]"
                        >
                            +
                            {/* ➕  */}
                        </Link>
                    </div>

                    <Link to="/items" className="flex flex-col items-center text-xs text-gray-600">
                        📦
                        <span>Items</span>
                    </Link>

                    <Link to="/pending" className="flex flex-col items-center text-xs text-gray-600 relative">
                        ⏳
                        <span>Pending</span>
                        {pendingBills.length > 0 ? <span className="w-3 h-3 absolute top-0 right-1 rounded-full grid place-content-center font-bold text-white bg-[tomato]">{pendingBills.length}</span>:null}
                    </Link>
                    {/* 
                    <Link to="/profile" className="flex flex-col items-center text-xs text-gray-600">
                        ⚙️
                        <span>Profile</span>
                    </Link>  */}
                </nav>



                {/* Pages */}
                <div className="p-4">
                    <Routes>
                        <Route path="/recipients" element={<RecipientsPage />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/receipt" element={<ReceiptGenerator />} />
                        <Route path="/pending" element={<Pending />} />
                        <Route path="*" element={<RecipientsPage />} /> {/* Default route */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
