import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import AddItemModal from "./AddItemModal";
import ItemCard from "./ItemCard";
import SearchBar from "../../common/search/SearchBar";

export default function ItemsPage() {
  const items = useSelector((state) => state.items.list);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Inventory</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-blue-600"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search items..." />

      <div className="grid gap-3 mt-4 pb-40">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => <ItemCard key={idx} item={item} />)
        ) : (
          <p className="text-center text-gray-400 text-sm mt-10">
            No items found
          </p>
        )}
      </div>

      <AddItemModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
