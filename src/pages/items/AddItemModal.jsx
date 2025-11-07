import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToDB } from "../../redux/slice/itemsSlice";
import { X } from "lucide-react";

export default function AddItemModal({ open, onClose }) {
  const dispatch = useDispatch();
  const units = useSelector((state) => state.units.list);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState(units[0] || "pcs");
  const [stockedDate, setStockedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setPrice(0);
      setQty(1);
      setUnit(units[0] || "pcs");
      setStockedDate("");
      setExpiryDate("");
    }
  }, [open, units]);

  const handleAdd = () => {
    if (!name.trim() || price <= 0 || qty <= 0) return;
    const id = `${name}-${Date.now()}`;
    dispatch(
      addItemToDB({
        id,
        name,
        price: Number(price),
        qty: Number(qty),
        unit,
        stockedDate,
        expiryDate,
      })
    );
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Add New Item
        </h2>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border mb-2 border-gray-300 p-2 rounded-lg w-full text-sm"
          />
          <label>Price</label>

          <input
            type="number"
            min="0"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full text-sm"
          />

          <div className="flex flex-col">
            {/* <label>Quantity</label>
            <input
              type="number"
              min="1"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 text-sm"
            /> */}
            {/* <select
              className="border border-gray-300 p-2 rounded-lg w-24 text-sm capitalize"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {units.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select> */}
          </div>

          {/* <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              value={stockedDate}
              onChange={(e) => setStockedDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 text-sm"
              placeholder="Stocked Date"
            />
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 text-sm"
              placeholder="Expiry Date"
            />
          </div> */}
        </div>

        <button
          onClick={handleAdd}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Save Item
        </button>
      </div>
    </div>
  );
}
