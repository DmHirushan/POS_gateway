import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getItems, addItem } from "../services/itemService";
import { getCustomers } from "../services/customerService";
import AddItemModal from "../components/PopUp";
import type { Item } from "../types/item";
import toast from "react-hot-toast";

// 📊 Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [itemCount, setItemCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const items = await getItems();
      const customers = await getCustomers();

      setItems(items);
      setItemCount(items.length);
      setCustomerCount(customers.length);
    } catch (e) {
      console.log("Dashboard load error", e);
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  // 📊 Chart data
  const chartData = [
    { name: "Items", count: itemCount },
    { name: "Customers", count: customerCount },
  ];

  return (
    <>
      <div className="flex">
        {/* 🔹 Sidebar */}
        <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

          <ul className="space-y-4">
            <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
            <li className="hover:text-gray-300 cursor-pointer">Items</li>
            <li className="hover:text-gray-300 cursor-pointer">Customers</li>
          </ul>
        </div>

        {/* 🔹 Main Content */}
        <div className="flex-1">
          <Navbar />

          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* 🔹 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              
              <div className="bg-linear-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
                <h2>Total Items</h2>
                <p className="text-3xl font-bold">{itemCount}</p>
              </div>

              <div className="bg-linear-to-r from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg">
                <h2>Total Customers</h2>
                <p className="text-3xl font-bold">{customerCount}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-center">
                <h2 className="text-gray-500 mb-2">Quick Actions</h2>

                <button
                  onClick={handleAdd}
                  className="bg-blue-600 text-white px-4 py-2 rounded mb-2 hover:bg-blue-700 transition"
                >
                  + Add Item
                </button>

                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  + Add Customer
                </button>
              </div>
            </div>

            {/* 📊 Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCount={items.length}
        onAdd={async (item) => {
          const promise =  addItem(item);

          toast.promise(promise, {
            loading: "Adding item...",
            success: "Item added successfully 🥂",
            error: "Failed to add item ❌"
          });

          setIsModalOpen(false);
          loadData();
        }}
      />
    </>
  );
};

export default Home;