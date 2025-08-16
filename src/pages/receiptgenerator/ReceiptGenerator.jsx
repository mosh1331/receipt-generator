import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import ReceiptModal from "./previewModal/PreviewModal";
import dayjs from "dayjs";

export default function ReceiptGenerator() {
  const [date, setDate] = useState();
  const [issuedTo, setIssuedTo] = useState("");
  const [items, setItems] = useState([]);
  const recipients = useSelector((state) => state.recipients.list);
  const products = useSelector((state) => state.items.list);
  const [showPreview, setShowPreview] = useState(false)
console.log(products,'producsts')
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

  //set initial data
  useEffect(() => {
    const initalProduct = products.length > 0 ? products[0] : ''
    const initalReceivee = recipients.length > 0 ? recipients[0] : ''
    setDate(dayjs().format("YYYY-MM-DD"))
    setItems([{ description: initalProduct?.name, qty: 1, price: initalProduct?.price }])
    setIssuedTo(initalReceivee)
  }, [])

  return (
    <div className="p-2 max-w-md mx-auto space-y-6">
      {/* Form */}
      <div className="space-y-4 py-6 bg-white p-4 rounded-xl shadow">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            console.log(e.target.value, 'date')
            setDate(e.target.value)
          }}
          className="w-full border p-2 rounded"
        />
        <select className="capitalize border rounded p-2" name="" value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)} id="">
          {recipients.map((r, idx) => (
            <option key={idx} className="p-2 border capitalize rounded flex justify-between">
              {r}
            </option>
          ))}
        </select>
        {items.map((item, idx) => (
          <div key={idx} className=" gap-2 w-full">
            <select
              className="capitalize border p-2 mb-2 rounded"
              name="item"
              value={item.id || ""}
              onChange={(e) => {
                const selected = products.find((p) => p.id === e.target.value);
                handleItemChange(idx, "id", selected.id);
                handleItemChange(idx, "description", selected.name);
                handleItemChange(idx, "price", selected.price); // auto-fill price from product
              }}
            >
              <option value="">Select Item</option>
              {products.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="flex">
              <div className="flex items-center border rounded w-[70%]">
                <button
                  type="button"
                  onClick={() => handleItemChange(idx, "qty", Math.max(1, item.qty - 1))}
                  className="px-2 text-lg  text-gray-600 hover:text-black"
                >
                  –
                </button>

                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                  className="w-full text-center p-2 focus:outline-none"
                  step={1}
                />

                <button
                  type="button"
                  onClick={() => handleItemChange(idx, "qty", Number(item.qty) + 1)}
                  className="px-2 text-lg text-gray-600 hover:text-black"
                >
                  +
                </button>
              </div>
              <div className="w-[30%] border bg-gray-300 p-2 rounded">₹{item.price}</div>
              {/* <input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                className="w-[50%] border p-2 rounded"
                disabled
              /> */}
            </div>
          </div>
        ))}
        <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Item
        </button>
        <div className="flex gap-2">
          <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded flex-1">
            Reset
          </button>
          <button onClick={() => setShowPreview(true)} className="bg-green-500 text-white px-4 py-2 rounded flex-1">
            Preview
          </button>
        </div>
      </div>

      {/* Receipt Preview */}
      <ReceiptModal
        isOpen={showPreview} onClose={() => setShowPreview(false)} date={date} issuedTo={issuedTo} items={items} grandTotal={grandTotal}
      />
    </div>
  );
}
