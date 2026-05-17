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
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const itemsData = await getItems();
      const customerData = await getCustomers();
      setItems(itemsData);
      setCustomers(customerData);
    } catch (e) { console.error(e); }
  };

  const calculateItemTotal = () => {
    const item = items.find((i) => i.id === selectedItem);
    if (!item) return 0;
    return item.price * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedCustomer) { alert("Please select a customer"); return; }
    if (!selectedItem) { alert("Please select an item"); return; }
    const item = items.find((i) => i.id === selectedItem);
    if (!item) return;
    const existingItem = cartItems.find((c) => c.itemId === item.id);
    if (existingItem) {
      setCartItems(cartItems.map((c) =>
        c.itemId === item.id
          ? { ...c, quantity: c.quantity + quantity, total: (c.quantity + quantity) * c.price }
          : c
      ));
    } else {
      setCartItems([...cartItems, { itemId: item.id, name: item.name, price: item.price, quantity, total: item.price * quantity }]);
    }
    setSelectedItem(0);
    setQuantity(1);
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems(cartItems.filter((item) => item.itemId !== itemId));
  };

  const grandTotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) { alert("Cart is empty"); return; }
    const transactionData = { customer: selectedCustomer, items: cartItems, grandTotal };
    cartItems.map(async (item) => {
      const realItem = await getItembyId(item.itemId);
      realItem.quantity = realItem.quantity - item.quantity;
      updateItem(realItem, item.itemId);
    });
    saveOrder(transactionData);
    setCheckoutDone(true);
    setTimeout(() => {
      setCartItems([]);
      setSelectedItem(0);
      setQuantity(1);
      setCheckoutDone(false);
    }, 2000);
  };

  const selectedItemObj = items.find((i) => i.id === selectedItem);
  const itemTotal = calculateItemTotal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');

        .txn-root {
          font-family: 'Geist', system-ui, sans-serif;
          min-height: calc(100vh - 70px);
          background: #f8f9fb;
          padding: 28px 32px;
          box-sizing: border-box;
        }

        /* ── Header ── */
        .txn-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .txn-title {
          font-size: 19px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .txn-order-id {
          font-size: 12px;
          color: #9ca3af;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 3px 12px;
        }

        /* ── Two-column layout ── */
        .txn-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .txn-layout { grid-template-columns: 1fr; }
          .txn-root { padding: 16px; }
        }

        /* ── Cards ── */
        .txn-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 16px;
          overflow: hidden;
        }
        .txn-card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .txn-card-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .txn-card-body { padding: 20px; }

        /* ── Customer selector ── */
        .customer-locked {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #f8f9fb;
          border: 1px solid #e9eaec;
          border-radius: 10px;
        }
        .customer-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #eff6ff;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }
        .customer-name  { font-size: 14px; font-weight: 500; color: #111827; }
        .customer-addr  { font-size: 12px; color: #9ca3af; }
        .customer-locked-badge {
          margin-left: auto;
          font-size: 11px;
          background: #fef9c3;
          color: #854d0e;
          border-radius: 999px;
          padding: 2px 9px;
          font-weight: 500;
          border: 1px solid #fde68a;
        }

        /* ── Form selects / inputs ── */
        .txn-select, .txn-input {
          width: 100%;
          padding: 10px 13px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          font-size: 13.5px;
          color: #111827;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          appearance: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .txn-select:focus, .txn-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .txn-select:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .txn-form-row {
          display: grid;
          grid-template-columns: 1fr 110px;
          gap: 10px;
          margin-top: 14px;
        }
        .txn-form-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }

        /* ── Item preview ── */
        .item-preview {
          margin-top: 14px;
          padding: 12px 14px;
          background: #f8f9fb;
          border: 1px solid #e9eaec;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .item-preview-name { font-size: 13.5px; font-weight: 500; color: #111827; }
        .item-preview-price { font-size: 12px; color: #9ca3af; }
        .item-preview-total { font-size: 15px; font-weight: 600; color: #16a34a; }

        /* ── Add to cart btn ── */
        .txn-add-btn {
          width: 100%;
          margin-top: 14px;
          padding: 11px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: background 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .txn-add-btn:hover  { background: #1e40af; }
        .txn-add-btn:active { transform: scale(0.99); }

        /* ── Cart table ── */
        .cart-table { width: 100%; border-collapse: collapse; }
        .cart-table th {
          padding: 11px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-bottom: 1.5px solid #f3f4f6;
        }
        .cart-table td {
          padding: 13px 16px;
          font-size: 13.5px;
          color: #374151;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }
        .cart-table tbody tr:last-child td { border-bottom: none; }
        .cart-table tbody tr:hover { background: #fafafa; }

        .cart-item-name { font-weight: 500; color: #111827; }
        .cart-item-price { color: #6b7280; font-size: 13px; }
        .cart-qty-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 22px;
          padding: 0 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          background: #eff6ff;
          color: #3b82f6;
        }
        .cart-total-cell { font-weight: 600; color: #111827; }
        .cart-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #9ca3af;
          padding: 5px 10px;
          border-radius: 7px;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .cart-remove-btn:hover {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #ef4444;
        }

        /* ── Empty cart ── */
        .cart-empty {
          padding: 48px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .cart-empty-icon  { font-size: 32px; margin-bottom: 4px; }
        .cart-empty-title { font-size: 14px; font-weight: 600; color: #374151; }
        .cart-empty-sub   { font-size: 12.5px; color: #9ca3af; }

        /* ── Order summary panel ── */
        .summary-panel {
          padding: 20px;
          border-top: 1.5px solid #f3f4f6;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 13.5px;
          color: #6b7280;
        }
        .summary-row.total {
          border-top: 1px solid #e9eaec;
          margin-top: 8px;
          padding-top: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .summary-grand { font-size: 20px; font-weight: 700; color: #16a34a; letter-spacing: -0.02em; }

        /* ── Checkout button ── */
        .txn-checkout-btn {
          width: 100%;
          margin-top: 16px;
          padding: 13px;
          background: #16a34a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }
        .txn-checkout-btn:hover  { background: #15803d; }
        .txn-checkout-btn:active { transform: scale(0.99); }
        .txn-checkout-btn:disabled {
          background: #d1fae5;
          color: #6ee7b7;
          cursor: not-allowed;
        }
        .txn-checkout-btn.success { background: #15803d; }

        /* ── Customer info in summary ── */
        .summary-customer {
          padding: 12px 16px;
          background: #f8f9fb;
          border-radius: 10px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e9eaec;
        }
        .summary-customer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #eff6ff;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
        }
        .summary-customer-name { font-size: 13px; font-weight: 500; color: #111827; }
        .summary-customer-addr { font-size: 11.5px; color: #9ca3af; }

        .select-wrap { position: relative; }
        .select-wrap::after {
          content: '▾';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          font-size: 12px;
        }
      `}</style>

      <Navbar />

      <div className="txn-root">

        {/* Header */}
        <div className="txn-header">
          <h1 className="txn-title">New Transaction</h1>
          <span className="txn-order-id">
            Order #{String(Date.now()).slice(-6)}
          </span>
        </div>

        <div className="txn-layout">

          {/* ── LEFT: Item selector + cart ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Customer + Item selector card */}
            <div className="txn-card">
              <div className="txn-card-header">
                <p className="txn-card-title">🛍 Build order</p>
              </div>
              <div className="txn-card-body">

                {/* Customer */}
                <label className="txn-form-label">Customer</label>
                {selectedCustomer && cartItems.length > 0 ? (
                  <div className="customer-locked">
                    <div className="customer-avatar">{selectedCustomer.name.charAt(0)}</div>
                    <div>
                      <div className="customer-name">{selectedCustomer.name}</div>
                      <div className="customer-addr">{selectedCustomer.address}</div>
                    </div>
                    <span className="customer-locked-badge">🔒 Locked</span>
                  </div>
                ) : (
                  <div className="select-wrap">
                    <select
                      className="txn-select"
                      disabled={cartItems.length > 0}
                      value={selectedCustomer?.id || 0}
                      onChange={(e) => {
                        const customer = customers.find((c) => c.id === Number(e.target.value));
                        setSelectedCustomer(customer || null);
                      }}
                    >
                      <option value={0}>Select a customer…</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} — {c.address}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Item + Qty */}
                <div className="txn-form-row" style={{ marginTop: 16 }}>
                  <div>
                    <label className="txn-form-label">Item</label>
                    <div className="select-wrap">
                      <select
                        className="txn-select"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(Number(e.target.value))}
                      >
                        <option value={0}>Select an item…</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — ${Number(item.price).toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="txn-form-label">Qty</label>
                    <input
                      className="txn-input"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Item preview */}
                {selectedItemObj && (
                  <div className="item-preview">
                    <div>
                      <div className="item-preview-name">{selectedItemObj.name}</div>
                      <div className="item-preview-price">
                        ${Number(selectedItemObj.price).toFixed(2)} × {quantity}
                      </div>
                    </div>
                    <div className="item-preview-total">
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                )}

                <button className="txn-add-btn" onClick={handleAddToCart}>
                  <span style={{ fontSize: 16 }}>+</span> Add to cart
                </button>
              </div>
            </div>

            {/* Cart card */}
            <div className="txn-card">
              <div className="txn-card-header">
                <p className="txn-card-title">
                  🛒 Cart
                  {cartItems.length > 0 && (
                    <span style={{
                      background: "#1d4ed8", color: "#fff",
                      borderRadius: "999px", fontSize: 11,
                      padding: "1px 8px", fontWeight: 500,
                    }}>
                      {cartItems.length}
                    </span>
                  )}
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <div className="cart-empty-title">Your cart is empty</div>
                  <div className="cart-empty-sub">Select an item above and add it to the cart</div>
                </div>
              ) : (
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.itemId}>
                        <td><span className="cart-item-name">{item.name}</span></td>
                        <td><span className="cart-item-price">${Number(item.price).toFixed(2)}</span></td>
                        <td><span className="cart-qty-badge">{item.quantity}</span></td>
                        <td><span className="cart-total-cell">${item.total.toFixed(2)}</span></td>
                        <td>
                          <button
                            className="cart-remove-btn"
                            onClick={() => handleRemoveItem(item.itemId)}
                          >
                            ✕ Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="txn-card" style={{ position: "sticky", top: 24 }}>
            <div className="txn-card-header">
              <p className="txn-card-title">📋 Order summary</p>
            </div>
            <div className="txn-card-body" style={{ paddingBottom: 0 }}>

              {/* Customer preview in summary */}
              {selectedCustomer ? (
                <div className="summary-customer">
                  <div className="summary-customer-avatar">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="summary-customer-name">{selectedCustomer.name}</div>
                    <div className="summary-customer-addr">{selectedCustomer.address}</div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: "10px 14px", background: "#fff7ed",
                  border: "1px solid #fed7aa", borderRadius: 10,
                  fontSize: 12.5, color: "#92400e", marginBottom: 14,
                }}>
                  ⚠️ No customer selected yet
                </div>
              )}
            </div>

            <div className="summary-panel">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Items</span>
                <span>{cartItems.reduce((s, i) => s + i.quantity, 0)} units</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span style={{ color: "#9ca3af" }}>—</span>
              </div>
              <div className="summary-row total">
                <span>Grand total</span>
                <span className="summary-grand">${grandTotal.toFixed(2)}</span>
              </div>

              <button
                className={`txn-checkout-btn${checkoutDone ? " success" : ""}`}
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || !selectedCustomer}
              >
                {checkoutDone ? "✅ Order placed!" : "✓ Place order"}
              </button>

              {cartItems.length === 0 && (
                <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                  Add items to enable checkout
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Transaction;
