import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOrders } from "../services/orderService";
import type { Customer } from "../types/customer";

type OrderItem = {
  itemId: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
};  

type Order = {
  _id: string;
  orderId: string;
  customer: Customer;
  items: OrderItem[];
  grandTotal: number;
  createdAt: string;
};

const History = () => {

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);
    
  
  const loadOrders = async () => {
    try {

      const data = await getOrders();

      setOrders(data);

    } catch (e) {

      console.error(e);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold mb-6">
          Order History
        </h1>

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6"
            >

              {/* ORDER HEADER */}
              <div className="flex justify-between items-center border-b pb-4 mb-4">

                <div>
                  <h2 className="text-xl font-bold text-blue-600">
                    {order.orderId}
                  </h2>

                  <p className="text-gray-600">
                    Customer : {order.customer.name}, {order.customer.address}
                  </p>
                </div>

                <div className="text-right">
                  <h2 className="text-2xl font-bold text-green-600">
                    ${order.grandTotal}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ITEMS TABLE */}
             <div className="overflow-x-auto">

  <table className="w-full table-fixed border-collapse">

    <thead>
      <tr className="border-b text-left bg-gray-50">

        <th className="p-3 w-[40%]">
          Item
        </th>

        <th className="p-3 w-[20%]">
          Price
        </th>

        <th className="p-3 w-[20%]">
          Qty
        </th>

        <th className="p-3 w-[20%]">
          Total
        </th>

      </tr>
    </thead>

    <tbody>

      {order.items.map((item, index) => (

        <tr
          key={index}
          className="border-b hover:bg-gray-50"
        >

          {/* ITEM NAME */}
          <td className="p-3 wrap-break-words whitespace-normal">

            {item.name}

          </td>

          {/* PRICE */}
          <td className="p-3">

            ${item.price}

          </td>

          {/* QTY */}
          <td className="p-3">

            {item.quantity}

          </td>

          {/* TOTAL */}
          <td className="p-3 text-green-600 font-bold">

            ${item.quantity * item.price}

          </td>

        </tr>
      ))}

    </tbody>
  </table>
</div>
            </div>
          ))}

          {orders.length === 0 && (

            <div className="bg-white rounded-xl shadow-md p-10 text-center text-gray-500">

              No orders found

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;