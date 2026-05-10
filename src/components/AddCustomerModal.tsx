import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: {
    id: number;
    name: string;
    address: string;
    telPhone: string;
  }) => void;
  customerCount: number; // for next ID display
};

const AddCustomerModal = ({
  isOpen,
  onClose,
  onAdd,
}: Props) => {
  const [id, setId] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [telPhone, setTelPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !address || !telPhone) {
      alert("All fields are required");
      return;
    }

    onAdd({ id, name, address, telPhone });

    // reset
    setName("");
    setAddress("");
    setTelPhone("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Customer</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Customer Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Address */}
        <input
          type="text"
          placeholder="Address"
          className="w-full mb-3 p-2 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Telephone */}
        <input
          type="text"
          placeholder="Telephone"
          className="w-full mb-4 p-2 border rounded"
          value={telPhone}
          onChange={(e) => setTelPhone(e.target.value)}
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;