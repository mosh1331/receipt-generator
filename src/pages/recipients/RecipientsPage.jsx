import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecipient,removeRecipient, resetRecipients } from "../../redux/slice/recipientsSlice";

export default function RecipientsPage() {
  const dispatch = useDispatch();
  const recipients = useSelector((state) => state.recipients.list);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    dispatch(addRecipient(name));
    setName("");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Recipients</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Recipient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {recipients.map((r, idx) => (
          <li key={idx} className="p-2 border  capitalize rounded flex justify-between">
            {r}
            <button
              onClick={() => dispatch(removeRecipient(idx))}
              className="text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      {recipients.length > 0 && (
        <button
          onClick={() => dispatch(resetRecipients())}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
        >
          Reset All
        </button>
      )}
    </div>
  );
}
