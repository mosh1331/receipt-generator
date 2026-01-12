import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // nice icons
import dayjs from "dayjs";

const PendingBillCard = ({ bill, onPay, onRemove, onAddAnotherBill }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(bill,'bill')

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-4 overflow-hidden">
      {/* Header Row */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="font-semibold text-lg capitalize">{bill.customer}</h2>
          <p className="text-xs text-gray-500">
            Balance: <span className="text-red-500 font-bold">₹{bill.balance}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              bill.status === "unpaid"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {bill.status}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Bill Info */}
          <div className="text-sm text-gray-600 space-y-1 mb-3">
            <p>
              <span className="font-medium">Total:</span> ₹{bill.total}
            </p>
            <p>
              <span className="font-medium">Received:</span> ₹{bill.receivedAmount}
            </p>
            <p className="text-xs text-gray-400">Date: {bill.id}</p>
          </div>

          {/* Items Preview */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            {bill.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-xs text-gray-700 py-1"
              >
                <span className="truncate w-1/2">{item.description}</span>
                <span>
                  {item.qty} × ₹{item.price}
                </span>
              </div>
            ))}
            {bill.transactions?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-xs text-gray-700 py-1"
              >
                {/* <span className=" w-1/2">Received @ {item.date}</span> */}
                <span>
                   - ₹{item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onRemove(bill.id)}
              className="px-3 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Remove
            </button>
            <button
              onClick={() => onPay(bill)}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Received
            </button>
            <button
              onClick={() => onAddAnotherBill(bill)}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Add Another Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBillCard;
