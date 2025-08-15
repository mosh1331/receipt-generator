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
    const initalProduct= products.length > 0 ?  products[0] :''
    const initalReceivee= recipients.length > 0 ?  recipients[0] :''
    setDate(dayjs().format("YYYY-MM-DD"))
    setItems([{ description: initalProduct, qty: 1, price: 0 }])
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
            console.log(e.target.value,'date')
            setDate(e.target.value)
          }}
          className="w-full border p-2 rounded"
        />
        <select className="capitalize border" name="" value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)} id="">
          {recipients.map((r, idx) => (
            <option key={idx} className="p-2 border capitalize rounded flex justify-between">
              {r}
            </option>
          ))}
        </select>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 w-full">
            <select className="capitalize border" placeholder={'Item'} name="item" value={item.description} onChange={(e) => handleItemChange(idx, "description", e.target.value)} id="">
              {products.map((r, idx) => (
                <option key={idx} className="p-2 border capitalize rounded flex justify-between">
                  {r}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
              className="w-[25%] border p-2 rounded"
            />
            <input
              type="number"
              min="0"
              value={item.price}
              onChange={(e) => handleItemChange(idx, "price", e.target.value)}
              className="w-[25%] border p-2 rounded"
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
