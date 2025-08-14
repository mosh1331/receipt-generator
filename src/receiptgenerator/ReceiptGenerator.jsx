import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function ReceiptGenerator() {
  const [date, setDate] = useState();
  const [issuedTo, setIssuedTo] = useState("");
  const [items, setItems] = useState([{ description: "", qty: 1, price: 0 }]);
  const receiptRef = useRef(null);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "qty" || field === "price" ? Number(value) : value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", qty: 1, price: 0 }]);
  };

  const resetForm = () => {
    setDate("");
    setIssuedTo("");
    setItems([{ description: "", qty: 1, price: 0 }]);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const generateImage = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current, { scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "receipt.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  useEffect(()=>{
    setDate(JSON.stringify(new Date()))
  },[])

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      {/* Form */}
      <div className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Issued to"
          value={issuedTo}
          onChange={(e) => setIssuedTo(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(idx, "description", e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
              className="w-12 border p-2 rounded"
            />
            <input
              type="number"
              min="0"
              value={item.price}
              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              className="w-12 border p-2 rounded"
            />
          </div>
        ))}
        <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Item
        </button>
        <div className="flex gap-2">
          <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded flex-1">
            Reset
          </button>
          <button onClick={generateImage} className="bg-green-500 text-white px-4 py-2 rounded flex-1">
            Download Image
          </button>
        </div>
      </div>

      {/* Receipt Preview */}
      <div ref={receiptRef} className="relative bg-white p-6 rounded-xl shadow-lg overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rotate-45 translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300 rotate-45 -translate-x-12 translate-y-12"></div>

        {/* Header */}
        <div className="relative z-10 text-left mb-20">
          <h1 className="text-2xl font-bold">POLAR </h1>
          <h1 className="text-2xl font-bold uppercase">Agencies </h1>
          
          <div className="flex justify-between mt-2 text-[8px]">
            <span>Date Issued: {date}</span>
            <span>Issued to: {issuedTo}</span>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mt-6 text-[10px] relative z-10 border-t border-b border-gray-300">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 border-">{item.description}</td>
                <td className="text-center">{item.qty}</td>
                <td className="text-center">₹{item.price}</td>
                <td className="text-center">₹{item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end gap-4 mt-4 text-[12px] font-bold relative z-10 mb-20">
          <span>GRAND TOTAL : </span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
