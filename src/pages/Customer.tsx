import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import type { Customer } from "../types/customer";
import { deleteCustomer, getCustomers } from "../services/customerService";
import toast from "react-hot-toast";

const Customer = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
      loadCustomers();
    }, []);

    const loadCustomers = async () => {
      const data = await getCustomers();
      setCustomers(data);
    }

    const handleDelete = (id: number) => {
    toast((t) => (
    <div className="flex flex-col">
      <span>Are you sure you want to delete?</span>

      <div className="flex gap-2 mt-2">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={async () => {
            await deleteCustomer(id);
            await loadCustomers();
            toast.dismiss(t.id);
            toast.success("Customer deleted ✅");
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
    
  return (
    <>
        <Navbar />
        <div className="p-6">
        
        {/* ✅ NEW: Top section with button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Customer</h1>
          <button
            onClick={() => {}}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add New Customer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Telephone</th>  
                
                {/* ✅ NEW COLUMN */}
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{customer.id}</td>
                  <td className="py-2 px-4">{customer.name}</td>
                  <td className="py-2 px-4">{customer.address}</td>
                  <td className="py-2 px-4">{customer.telNumber}</td>

                  {/* ✅ DELETE BUTTON */}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => {handleDelete(customer.id)}}
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
    </>
  )
}

export default Customer