import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getItems, deleteItem, addItem } from "../services/itemService";
import type { Item } from "../types/item";
import AddItemModal from "../components/PopUp";
import toast from "react-hot-toast";

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (e) {
      console.log("Error loading items ", e);
    }
  };

  const handleDelete = (id: number) => {
  toast((t) => (
    <div className="flex flex-col">
      <span>Are you sure you want to delete?</span>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={async () => {
            await deleteItem(id);
            await loadItems();
            toast.dismiss(t.id);
            toast.success("Item deleted ✅");
          }}
        >
          Yes
        </button>

        <button
          className="bg-gray-400 text-white px-3 py-1 rounded"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  ));
};

  // ✅ NEW: add button handler (placeholder)
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        
        {/* ✅ NEW: Top section with button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Items</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add New Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Price ($)</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                
                {/* ✅ NEW COLUMN */}
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.price}</td>
                  <td className="py-2 px-4">{item.quantity}</td>

                  {/* ✅ DELETE BUTTON */}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCount={items.length}
        onAdd={async (item) => {
          const promise = addItem(item);

          toast.promise(promise, {
            loading: "Adding item...",
            success: "Item added successfully 🥂",
            error: "Failed to add item ❌"
          });

          loadItems();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default Items;