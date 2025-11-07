import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeItemFromDB } from "../../redux/slice/itemsSlice";

export default function ItemCard({ item }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const totalValue = item.price * item.qty;
  const expired = item.expiryDate && new Date(item.expiryDate) < new Date();

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 transition-all duration-300 ${
        expanded ? "shadow-lg" : ""
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-semibold text-gray-800 text-lg capitalize">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600">
            Total: ₹{totalValue.toLocaleString()}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>

      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3 text-sm space-y-1">
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> ₹{item.price}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Stock:</span> {item.qty} {item.unit}
          </p>

          {item.stockedDate && (
            <p className="text-gray-500 text-xs">
              <span className="font-medium text-gray-700">Stocked:</span>{" "}
              {new Date(item.stockedDate).toLocaleDateString()}
            </p>
          )}

          {item.expiryDate && (
            <p
              className={`text-xs ${
                expired ? "text-red-600 font-semibold" : "text-gray-500"
              }`}
            >
              <span className="font-medium text-gray-700">Expires:</span>{" "}
              {new Date(item.expiryDate).toLocaleDateString()}
            </p>
          )}

          <button
            onClick={() => dispatch(removeItemFromDB(item.id))}
            className="flex items-center gap-1 text-red-500 text-xs mt-2 hover:text-red-700"
          >
            <Trash2 size={14} />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
