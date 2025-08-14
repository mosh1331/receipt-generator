import html2canvas from "html2canvas";
import React, { useRef } from "react";

export default function ReceiptModal({ isOpen, onClose, date, issuedTo, items, grandTotal }) {
    const receiptRef = useRef(null);

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
    
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full relative overflow-hidden">
        {/* Close Button */}
       
        {/* Receipt Content */}
        <div ref={receiptRef} className="relative bg-white p-6 rounded-xl shadow-lg overflow-hidden">
          {/* Decorative Shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rotate-45 translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300 rotate-45 -translate-x-12 translate-y-12"></div>

          {/* Header */}
          <div className="relative z-10 text-left mb-20">
            <h1 className="text-2xl font-bold">POLAR</h1>
            <h1 className="text-2xl font-bold uppercase">Agencies</h1>

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
                  <td className="py-2">{item.description}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-center">₹{item.price}</td>
                  <td className="text-center">₹{item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-end gap-4 mt-4 text-[12px] font-bold relative z-10 mb-20">
            <span>GRAND TOTAL :</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
       <div className="flex w-full ">
       <button
          onClick={onClose}
          className="bg-[tomato] w-1/2 text-white px-4 py-2  flex-1"
        >
          Cancel
        </button>
        <button onClick={generateImage} className="bg-green-500 w-1/2  text-white px-4 py-2  flex-1">
           Dowmload
          </button>
       </div>
      </div>
    </div>
  );
}
