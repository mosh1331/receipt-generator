import React from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  loadItems,
} from "../redux/slice/itemsSlice";
import {
  loadRecipients,
} from "../redux/slice/recipientsSlice";
import { db } from "../db";

export default function BackupRestoreButton() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.list);
  const recipients = useSelector((state) => state.recipients.list);

  // 📤 EXPORT
  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // Products sheet
    const wsProducts = XLSX.utils.json_to_sheet(items);
    XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

    // Recipients sheet
    const wsRecipients = XLSX.utils.json_to_sheet(
      recipients.map((r) => ({ name: r }))
    );
    XLSX.utils.book_append_sheet(wb, wsRecipients, "Recipients");

    XLSX.writeFile(wb, "backup_data.xlsx");
  };

  // 📥 IMPORT
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const products = XLSX.utils.sheet_to_json(workbook.Sheets["Products"] || {});
    const recipientData = XLSX.utils.sheet_to_json(workbook.Sheets["Recipients"] || {});

    // Clear old data
    await db.products.clear();
    await db.recipients.clear();

    // Add imported data
    for (const p of products) await db.products.add(p);
    for (const r of recipientData) await db.recipients.add({ name: r.name });

    // Refresh redux
    dispatch(loadItems());
    dispatch(loadRecipients());

    e.target.value = null;
    alert('Successfully backed up products and customers data')
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 p-4 bg-white rounded-xl shadow max-w-md mx-auto">
      <button
        onClick={handleExport}
        className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-green-600 transition"
      >
        📤 Export Data
      </button>

      <label className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center cursor-pointer hover:bg-blue-600 transition">
        📥 Import Data
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleImport}
        />
      </label>
    </div>
  );
}
