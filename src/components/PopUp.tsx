import { useState } from "react";
import type { Item } from "../types/item";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  onAdd: (item: Omit<Item, "id">) => void;
};

const AddItemModal = ({ isOpen, onClose, itemCount, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !price || !quantity) {
      alert("All fields are required");
      return;
    }

    onAdd({
      name,
      price: Number(price),
      quantity: Number(quantity),
    });

    // reset fields
    setName("");
    setPrice("");
    setQuantity("");

    onClose();
    
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>

        <input
          type="text"
          className="w-full mb-3 p-2 border rounded bg-gray-100 cursor-not-allowed"
          value={itemCount + 1}
          readOnly
        />

        <input
          type="text"
          placeholder="Item Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full mb-3 p-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          className="w-full mb-4 p-2 border rounded"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;