import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getItembyId, getItems, updateItem } from "../services/itemService";
import { getCustomers } from "../services/customerService";
import { saveOrder } from "../services/orderService";

type Item = {
  id: number;
  name: string;
  price: number;
};

type Customer = {
  id: number;
  name: string;
  address: string;
};

type CartItem = {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

const Transaction = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const itemsData = await getItems();
      const customerData = await getCustomers();

      setItems(itemsData);
      setCustomers(customerData);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateItemTotal = () => {
    const item = items.find((i) => i.id === selectedItem);

    if (!item) return 0;

    return item.price * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedCustomer) {
      alert("Please select customer");
      return;
    }

    if (!selectedItem) {
      alert("Please select item");
      return;
    }

    const item = items.find((i) => i.id === selectedItem);

    if (!item) return;

    const existingItem = cartItems.find(
      (cartItem) => cartItem.itemId === item.id
    );

    if (existingItem) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.itemId === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + quantity,
              total:
                (cartItem.quantity + quantity) * cartItem.price,
            }
          : cartItem
      );

      setCartItems(updatedCart);
    } else {
      const newCartItem: CartItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        total: item.price * quantity,
      };

      setCartItems([...cartItems, newCartItem]);
    }

    setSelectedItem(0);
    setQuantity(1);
  };

  const handleRemoveItem = (itemId: number) => {
    const filteredItems = cartItems.filter(
      (item) => item.itemId !== itemId
    );

    setCartItems(filteredItems);
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const transactionData = {
      customer: selectedCustomer,
      items: cartItems,
      grandTotal,
    };

    cartItems.map(async (item) => {
      const realItem = await getItembyId(item.itemId);
      realItem.quantity = realItem.quantity - item.quantity;
      updateItem(realItem, item.itemId);
      console.log(realItem, "Item updated......");
    });

    console.log(transactionData);

    saveOrder(transactionData);

    alert("Order placed successfully!");

    // reset everything
    setCartItems([]);
    // setSelectedCustomer();
    setSelectedItem(0);
    setQuantity(1);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">
          Transaction Page
        </h1>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* CUSTOMER */}
          <select
            className="p-3 border rounded-lg"
            disabled={cartItems.length > 0}
            value={selectedCustomer?.id || 0}
            onChange={(e) => {

              const customer = customers.find(
                c => c.id === Number(e.target.value)
              );

              setSelectedCustomer(customer || null);
            }}
          >
            <option value={0}>Select Customer</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name} - {customer.address}
              </option>
            ))}
          </select>

          {/* ITEM */}
          <select
            className="p-3 border rounded-lg"
            value={selectedItem}
            onChange={(e) =>
              setSelectedItem(Number(e.target.value))
            }
          >
            <option value={0}>Select Item</option>

            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - ${item.price}
              </option>
            ))}
          </select>

          {/* QUANTITY */}
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="p-3 border rounded-lg"
          />

          {/* ITEM TOTAL */}
          <div className="flex items-center font-bold text-green-600 text-lg">
            Total: ${calculateItemTotal()}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Add To Cart
        </button>

        {/* CART TABLE */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            Cart Items
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Item</th>
                <th className="p-3">Price</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.itemId}
                  className="border-b"
                >
                  <td className="p-3">{item.name}</td>

                  <td className="p-3">
                    ${item.price}
                  </td>

                  <td className="p-3">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-green-600 font-bold">
                    ${item.total}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleRemoveItem(item.itemId)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* GRAND TOTAL */}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Grand Total:
              <span className="text-green-600 ml-2">
                ${grandTotal}
              </span>
            </h2>

            <button
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction;