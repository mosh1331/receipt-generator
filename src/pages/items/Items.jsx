import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, resetItems } from "../../redux/slice/itemsSlice";
import ConfirmModal from "../../common/confirmmodal/ConfirmModal";

export default function ItemsPage() {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items.list);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [open, setOpen] = useState(false);

    const handleAdd = () => {
        if (!name.trim() || price === 0) return;
        const id = `${name}-${price}`
        dispatch(addItem({ id, name, price }));
        setName("");
        setPrice(0);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className=" gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded flex-1 w-full"
                />
                <div className="flex w-full">
                    <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 rounded flex-1"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>
            <ul className="space-y-2">
                {items.map((r, idx) => (
                    <li key={idx} className="p-2 border  capitalize rounded flex justify-between">
                        {r.name} -  ₹{r.price}

                        <button
                            onClick={() => dispatch(removeItem(idx))}
                            className="text-red-500"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
            {items.length > 0 && (
                <button
                    onClick={()=>setOpen(true) }
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
                >
                    Reset All
                </button>
            )}
            <ConfirmModal
                isOpen={open}
                message="Do you really want to reset everything?"
                onConfirm={() => {
                    setOpen(false)
                    dispatch(resetItems())
                }}
                onCancel={() => setOpen(false)}
            />
        </div>
    );
}
