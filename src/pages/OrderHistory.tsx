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
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      if (data.length > 0) setExpandedId(data[0]._id);
    } catch (e) { console.error(e); }
  };

  const filteredOrders = orders.filter((o) =>
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((s, o) => s + o.grandTotal, 0);
  const totalItems   = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);

  const avatarColor = (name: string) => {
    const colors = [
      { bg: "#eff6ff", text: "#3b82f6" },
      { bg: "#f0fdf4", text: "#16a34a" },
      { bg: "#fdf4ff", text: "#a855f7" },
      { bg: "#fff7ed", text: "#f97316" },
      { bg: "#fdf2f8", text: "#ec4899" },
      { bg: "#f0fdfa", text: "#14b8a6" },
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');

        .hist-root {
          font-family: 'Geist', system-ui, sans-serif;
          min-height: calc(100vh - 70px);
          background: #f8f9fb;
          padding: 28px 32px;
          box-sizing: border-box;
        }

        /* ── Stat cards ── */
        .hist-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .hist-stat-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .hist-stat-icon {
          width: 42px; height: 42px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .hist-stat-icon.green  { background: #f0fdf4; }
        .hist-stat-icon.blue   { background: #eff6ff; }
        .hist-stat-icon.purple { background: #fdf4ff; }
        .hist-stat-label {
          font-size: 12px; color: #9ca3af; font-weight: 500;
          letter-spacing: 0.03em; text-transform: uppercase; margin-bottom: 2px;
        }
        .hist-stat-value {
          font-size: 22px; font-weight: 600; color: #111827; letter-spacing: -0.02em;
        }

        /* ── Toolbar ── */
        .hist-toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 16px; gap: 12px; flex-wrap: wrap;
        }
        .hist-title {
          font-size: 19px; font-weight: 600;
          color: #111827; letter-spacing: -0.02em; margin: 0;
          display: flex; align-items: center; gap: 10px;
        }
        .hist-count-badge {
          background: #f3f4f6; color: #6b7280;
          font-size: 12px; font-weight: 500;
          padding: 3px 10px; border-radius: 999px;
          border: 1px solid #e5e7eb;
        }
        .hist-search-wrap { position: relative; max-width: 280px; flex: 1; }
        .hist-search-icon {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%); color: #9ca3af;
          pointer-events: none; font-size: 14px;
        }
        .hist-search-input {
          width: 100%; padding: 8px 12px 8px 34px;
          border: 1px solid #e5e7eb; border-radius: 10px;
          background: #fff; font-size: 13.5px; color: #111827;
          font-family: inherit; outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .hist-search-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        /* ── Order cards ── */
        .hist-orders { display: flex; flex-direction: column; gap: 12px; }

        .hist-order-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.15s;
        }
        .hist-order-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

        .hist-order-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          user-select: none;
        }
        .hist-order-header:hover { background: #fafafa; }

        .hist-cust-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; flex-shrink: 0;
          text-transform: uppercase;
        }

        .hist-order-meta { flex: 1; min-width: 0; }
        .hist-order-id {
          font-size: 13px; font-weight: 600; color: #1d4ed8;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.01em;
        }
        .hist-order-customer {
          font-size: 13.5px; font-weight: 500; color: #111827; margin-top: 1px;
        }
        .hist-order-addr {
          font-size: 12px; color: #9ca3af;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .hist-order-right {
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
          flex-shrink: 0;
        }
        .hist-order-total {
          font-size: 17px; font-weight: 700; color: #16a34a; letter-spacing: -0.02em;
        }
        .hist-order-date {
          font-size: 11.5px; color: #9ca3af;
        }
        .hist-order-items-count {
          font-size: 11px; background: #f3f4f6; color: #6b7280;
          border-radius: 999px; padding: 2px 9px; border: 1px solid #e5e7eb;
        }

        .hist-chevron {
          font-size: 12px; color: #9ca3af;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .hist-chevron.open { transform: rotate(180deg); }

        /* ── Items table (inside expanded card) ── */
        .hist-items-wrap {
          border-top: 1px solid #f3f4f6;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.25s ease;
        }
        .hist-items-wrap.open { max-height: 1000px; }

        .hist-items-table {
          width: 100%; border-collapse: collapse;
        }
        .hist-items-table th {
          padding: 10px 20px;
          text-align: left;
          font-size: 11px; font-weight: 600; color: #9ca3af;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: #fafafa;
          border-bottom: 1px solid #f3f4f6;
        }
        .hist-items-table td {
          padding: 12px 20px;
          font-size: 13.5px; color: #374151;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }
        .hist-items-table tbody tr:last-child td { border-bottom: none; }
        .hist-items-table tbody tr:hover { background: #fafafa; }

        .hist-item-name { font-weight: 500; color: #111827; }
        .hist-item-price { color: #6b7280; font-size: 13px; }
        .hist-qty-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 22px; padding: 0 8px;
          border-radius: 6px; font-size: 12px; font-weight: 600;
          background: #eff6ff; color: #3b82f6;
        }
        .hist-line-total { font-weight: 600; color: #111827; }

        /* ── Table footer ── */
        .hist-items-footer {
          padding: 12px 20px;
          background: #fafafa;
          border-top: 1.5px solid #f3f4f6;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
        }
        .hist-footer-label { font-size: 13px; color: #6b7280; }
        .hist-footer-total { font-size: 16px; font-weight: 700; color: #16a34a; letter-spacing: -0.02em; }

        /* ── Empty state ── */
        .hist-empty {
          background: #fff; border: 1px solid #e9eaec;
          border-radius: 16px; padding: 72px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .hist-empty-icon  { font-size: 36px; margin-bottom: 4px; }
        .hist-empty-title { font-size: 15px; font-weight: 600; color: #374151; }
        .hist-empty-sub   { font-size: 13px; color: #9ca3af; }

        @media (max-width: 640px) {
          .hist-root  { padding: 16px; }
          .hist-stats { grid-template-columns: 1fr; }
          .hist-search-wrap { max-width: 100%; }
          .hist-order-addr { display: none; }
        }
      `}</style>

      <Navbar />

      <div className="hist-root">

        {/* ── Stat cards ── */}
        <div className="hist-stats">
          <div className="hist-stat-card">
            <div className="hist-stat-icon green">💰</div>
            <div>
              <div className="hist-stat-label">Total revenue</div>
              <div className="hist-stat-value">
                ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="hist-stat-card">
            <div className="hist-stat-icon blue">📦</div>
            <div>
              <div className="hist-stat-label">Total orders</div>
              <div className="hist-stat-value">{orders.length}</div>
            </div>
          </div>
          <div className="hist-stat-card">
            <div className="hist-stat-icon purple">🧾</div>
            <div>
              <div className="hist-stat-label">Units sold</div>
              <div className="hist-stat-value">{totalItems.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="hist-toolbar">
          <h1 className="hist-title">
            Order history
            {searchQuery && (
              <span className="hist-count-badge">
                {filteredOrders.length} of {orders.length}
              </span>
            )}
          </h1>
          <div className="hist-search-wrap">
            <span className="hist-search-icon">🔍</span>
            <input
              className="hist-search-input"
              type="text"
              placeholder="Search orders, customers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Orders ── */}
        <div className="hist-orders">
          {filteredOrders.length === 0 ? (
            <div className="hist-empty">
              <div className="hist-empty-icon">{searchQuery ? "🔍" : "🧾"}</div>
              <div className="hist-empty-title">
                {searchQuery ? `No orders matching "${searchQuery}"` : "No orders yet"}
              </div>
              <div className="hist-empty-sub">
                {searchQuery ? "Try a different search term" : "Completed transactions will appear here"}
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const color    = avatarColor(order.customer.name);
              const { date, time } = formatDate(order.createdAt);
              const isOpen   = expandedId === order._id;
              const unitCount = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div className="hist-order-card" key={order._id}>

                  {/* Header row — click to expand */}
                  <div
                    className="hist-order-header"
                    onClick={() => setExpandedId(isOpen ? null : order._id)}
                  >
                    <div
                      className="hist-cust-avatar"
                      style={{ background: color.bg, color: color.text }}
                    >
                      {order.customer.name.charAt(0)}
                    </div>

                    <div className="hist-order-meta">
                      <div className="hist-order-id">{order.orderId}</div>
                      <div className="hist-order-customer">{order.customer.name}</div>
                      <div className="hist-order-addr">{order.customer.address}</div>
                    </div>

                    <div className="hist-order-right">
                      <span className="hist-order-total">
                        ${Number(order.grandTotal).toFixed(2)}
                      </span>
                      <span className="hist-order-date">{date} · {time}</span>
                      <span className="hist-order-items-count">
                        {unitCount} unit{unitCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <span className={`hist-chevron${isOpen ? " open" : ""}`}>▼</span>
                  </div>

                  {/* Expandable items table */}
                  <div className={`hist-items-wrap${isOpen ? " open" : ""}`}>
                    <table className="hist-items-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td><span className="hist-item-name">{item.name}</span></td>
                            <td><span className="hist-item-price">${Number(item.price).toFixed(2)}</span></td>
                            <td><span className="hist-qty-badge">{item.quantity}</span></td>
                            <td><span className="hist-line-total">${(item.quantity * item.price).toFixed(2)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="hist-items-footer">
                      <span className="hist-footer-label">Order total</span>
                      <span className="hist-footer-total">${Number(order.grandTotal).toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default History;
