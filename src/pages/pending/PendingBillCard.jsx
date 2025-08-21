import React from "react";

const PendingBillCard = ({ bill, onPay, onRemove,onAddAnotherBill }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg capitalize">{bill.customer}</h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            bill.status === "unpaid"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {bill.status}
        </span>
      </div>

      {/* Bill Info */}
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>
          <span className="font-medium">Total:</span> ₹{bill.total}
        </p>
        <p>
          <span className="font-medium">Received:</span> ₹{bill.receivedAmount}
        </p>
        <p>
          <span className="font-medium">Balance:</span>{" "}
          <span className="text-red-500 font-bold">₹{bill.balance}</span>
        </p>
        <p className="text-xs text-gray-400">
          Date: {bill.date}
        </p>
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
          onClick={() =>  onAddAnotherBill(bill)}
          className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Another bill
        </button>
       
      </div>
    </div>
  );
};

export default PendingBillCard;
