import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUnit, removeUnit } from "../../redux/slice/unitsSlice";
import ConfirmModal from "../../common/confirmmodal/ConfirmModal";

export default function UnitsPage() {
  const dispatch = useDispatch();
  const units = useSelector((state) => state.units.list);
  const [unit, setUnit] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!unit.trim()) return;
    dispatch(addUnit(unit.trim().toLowerCase()));
    setUnit("");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto min-h-screen sm:min-h-0">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Manage Units</h2>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter unit (e.g., kg, cm)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border p-2 rounded flex-1 text-sm sm:text-base"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base"
        >
          Add
        </button>
      </div>

      {/* Unit List */}
      <ul className="space-y-2">
        {units.map((u, idx) => (
          <li
            key={idx}
            className="p-2 border rounded flex justify-between items-center text-sm sm:text-base capitalize"
          >
            <span>{u}</span>
            <button
              onClick={() => dispatch(removeUnit(u))}
              className="text-red-500 text-xs sm:text-sm"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {units.length > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="mt-6 bg-gray-600 text-white px-4 py-2 rounded w-full text-sm sm:text-base"
        >
          Reset All
        </button>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={open}
        message="Do you really want to remove ?"
        onConfirm={() => {
          setOpen(false);
          units.forEach((u) => dispatch(removeUnit(u)));
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
