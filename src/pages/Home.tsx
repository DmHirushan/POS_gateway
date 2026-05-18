import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getItems, addItem } from "../services/itemService";
import { getCustomers } from "../services/customerService";
import AddItemModal from "../components/PopUp";
import type { Item } from "../types/item";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
  PieChart, Pie, Legend,
} from "recharts";

const Home = () => {
  const [itemCount, setItemCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const fetchedItems = await getItems();
      const customers    = await getCustomers();
      setItems(fetchedItems);
      setItemCount(fetchedItems.length);
      setCustomerCount(customers.length);
    } catch (e) {
      console.log("Dashboard load error", e);
    }
  };

  // ── Derived analytics ──
  const totalInventoryValue = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalStock          = items.reduce((s, i) => s + i.quantity, 0);
  const lowStockItems       = items.filter((i) => i.quantity <= 5);
  const avgPrice            = items.length ? items.reduce((s, i) => s + i.price, 0) / items.length : 0;

  const topByValue = [...items]
    .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
    .slice(0, 6)
    .map((i) => ({
      name: i.name.length > 14 ? i.name.slice(0, 13) + "…" : i.name,
      value: +(i.price * i.quantity).toFixed(2),
    }));

  const stockBuckets = [
    { name: "Low (≤5)",   count: items.filter((i) => i.quantity <= 5).length,                    fill: "#ef4444" },
    { name: "Mid (6–20)", count: items.filter((i) => i.quantity > 5 && i.quantity <= 20).length, fill: "#f97316" },
    { name: "Good (>20)", count: items.filter((i) => i.quantity > 20).length,                    fill: "#16a34a" },
  ].filter((b) => b.count > 0);

  const BAR_COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#16a34a", "#ec4899", "#14b8a6"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "#fff", border: "1px solid #e9eaec", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "Geist, system-ui, sans-serif" }}>
        <p style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#6b7280" }}>Value: <span style={{ color: "#111827", fontWeight: 500 }}>${payload[0].value?.toLocaleString?.()}</span></p>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        .dash-shell { display: flex; min-height: 100vh; font-family: 'Geist', system-ui, sans-serif; background: #f8f9fb; }

        .dash-sidebar { width: 220px; background: #111827; min-height: 100vh; display: flex; flex-direction: column; flex-shrink: 0; padding: 28px 0 20px; }
        .dash-sidebar-brand { padding: 0 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .dash-logo { display: flex; align-items: center; gap: 9px; }
        .dash-logo-icon { width: 32px; height: 32px; border-radius: 9px; background: #1d4ed8; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .dash-logo-name { font-size: 15px; font-weight: 600; color: #fff; letter-spacing: -0.02em; }
        .dash-logo-sub  { font-size: 10px; color: #6b7280; letter-spacing: 0.03em; text-transform: uppercase; margin-top: 1px; }

        .dash-nav { padding: 20px 12px 0; flex: 1; }
        .dash-nav-section { font-size: 10.5px; font-weight: 600; color: #4b5563; letter-spacing: 0.08em; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; margin-top: 20px; }
        .dash-nav-section:first-child { margin-top: 0; }
        .dash-nav-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 9px; font-size: 13.5px; color: #9ca3af; cursor: pointer; margin-bottom: 2px; transition: background 0.12s, color 0.12s; text-decoration: none; border: none; background: transparent; width: 100%; text-align: left; font-family: inherit; }
        .dash-nav-item:hover  { background: rgba(255,255,255,0.06); color: #e5e7eb; }
        .dash-nav-item.active { background: #1d4ed8; color: #fff; }
        .nav-icon { font-size: 15px; opacity: 0.7; }
        .dash-nav-item.active .nav-icon { opacity: 1; }

        .dash-sidebar-footer { padding: 16px 12px 0; border-top: 1px solid rgba(255,255,255,0.07); margin-top: 12px; }
        .dash-version { font-size: 11px; color: #4b5563; padding: 0 8px; }

        .dash-main    { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .dash-content { padding: 28px 28px 40px; flex: 1; }

        .dash-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .dash-page-title  { font-size: 19px; font-weight: 600; color: #111827; letter-spacing: -0.02em; margin: 0; }
        .dash-page-sub    { font-size: 13px; color: #9ca3af; margin-top: 2px; }
        .dash-add-btn { display: flex; align-items: center; gap: 6px; background: #1d4ed8; color: #fff; border: none; padding: 9px 18px; border-radius: 10px; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: inherit; letter-spacing: -0.01em; transition: background 0.15s, transform 0.1s; }
        .dash-add-btn:hover  { background: #1e40af; }
        .dash-add-btn:active { transform: scale(0.98); }

        .dash-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .dash-kpi-card { background: #fff; border: 1px solid #e9eaec; border-radius: 14px; padding: 18px 20px; }
        .dash-kpi-top  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .dash-kpi-label { font-size: 12px; font-weight: 500; color: #9ca3af; letter-spacing: 0.03em; text-transform: uppercase; }
        .dash-kpi-icon  { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .dash-kpi-value { font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.03em; line-height: 1; }
        .dash-kpi-sub   { font-size: 12px; color: #9ca3af; margin-top: 4px; }
        .dash-kpi-sub.warn { color: #ef4444; }

        .dash-charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .dash-chart-card   { background: #fff; border: 1px solid #e9eaec; border-radius: 16px; overflow: hidden; }
        .dash-chart-header { padding: 16px 20px 0; }
        .dash-chart-title  { font-size: 14px; font-weight: 600; color: #111827; }
        .dash-chart-sub    { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .dash-chart-body   { padding: 16px 8px 16px; }

        .dash-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .dash-table-card   { background: #fff; border: 1px solid #e9eaec; border-radius: 16px; overflow: hidden; }
        .dash-table-header { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
        .dash-table-title  { font-size: 14px; font-weight: 600; color: #111827; }
        .dash-alert-badge  { font-size: 11px; background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; border-radius: 999px; padding: 2px 9px; font-weight: 500; }

        .dash-inner-table { width: 100%; border-collapse: collapse; }
        .dash-inner-table th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #9ca3af; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; background: #fafafa; }
        .dash-inner-table td { padding: 11px 16px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
        .dash-inner-table tbody tr:last-child td { border-bottom: none; }
        .dash-inner-table tbody tr:hover { background: #fafafa; }

        .qty-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 28px; height: 20px; padding: 0 7px; border-radius: 5px; font-size: 11.5px; font-weight: 600; }
        .qty-chip.red    { background: #fef2f2; color: #ef4444; }
        .qty-chip.orange { background: #fff7ed; color: #ea580c; }

        .dash-quick-card { background: #fff; border: 1px solid #e9eaec; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
        .dash-quick-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
        .dash-quick-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; border: 1px solid #e9eaec; background: #fff; cursor: pointer; font-family: inherit; transition: background 0.12s, border-color 0.12s; text-align: left; width: 100%; }
        .dash-quick-btn:hover { background: #f8f9fb; border-color: #d1d5db; }
        .dash-quick-btn-icon  { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .dash-quick-btn-label { font-size: 13.5px; font-weight: 500; color: #111827; }
        .dash-quick-btn-sub   { font-size: 12px; color: #9ca3af; }

        .empty-chart { height: 200px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 6px; }
        .empty-chart-icon  { font-size: 28px; opacity: 0.4; }
        .empty-chart-label { font-size: 13px; color: #9ca3af; }
        .no-low-stock { padding: 32px 16px; text-align: center; font-size: 13px; color: #9ca3af; }

        @media (max-width: 1024px) { .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px)  { .dash-charts-grid { grid-template-columns: 1fr; } .dash-bottom-grid { grid-template-columns: 1fr; } .dash-sidebar { display: none; } .dash-content { padding: 20px 16px; } }
      `}</style>

      <div className="dash-shell">

        {/* ── Sidebar ── */}
        {/* <aside className="dash-sidebar">
          <div className="dash-sidebar-brand">
            <div className="dash-logo">
              <div className="dash-logo-icon">🏪</div>
              <div>
                <div className="dash-logo-name">StoreAdmin</div>
                <div className="dash-logo-sub">Management</div>
              </div>
            </div>
          </div>

          <nav className="dash-nav">
            <div className="dash-nav-section">Main</div>
            <button className="dash-nav-item active" onClick={() => navigate("/")}>
              <span className="nav-icon">📊</span> Dashboard
            </button>
            <button className="dash-nav-item" onClick={() => navigate("/items")}>
              <span className="nav-icon">📦</span> Items
            </button>
            <button className="dash-nav-item" onClick={() => navigate("/customers")}>
              <span className="nav-icon">👥</span> Customers
            </button>
            <div className="dash-nav-section">Operations</div>
            <button className="dash-nav-item" onClick={() => navigate("/transaction")}>
              <span className="nav-icon">🛒</span> New transaction
            </button>
            <button className="dash-nav-item" onClick={() => navigate("/history")}>
              <span className="nav-icon">🧾</span> Order history
            </button>
          </nav>

          <div className="dash-sidebar-footer">
            <div className="dash-version">v1.0.0 · StoreAdmin</div>
          </div>
        </aside> */}

        {/* ── Main content ── */}
        <div className="dash-main">
          <Navbar />

          <div className="dash-content">

            {/* Page header */}
            <div className="dash-page-header">
              <div>
                <h1 className="dash-page-title">Dashboard</h1>
                <p className="dash-page-sub">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button className="dash-add-btn" onClick={() => setIsModalOpen(true)}>
                <span style={{ fontSize: 16 }}>+</span> Add item
              </button>
            </div>

            {/* KPI cards */}
            <div className="dash-kpi-grid">
              <div className="dash-kpi-card">
                <div className="dash-kpi-top">
                  <span className="dash-kpi-label">Total items</span>
                  <div className="dash-kpi-icon" style={{ background: "#eff6ff" }}>📦</div>
                </div>
                <div className="dash-kpi-value">{itemCount}</div>
                <div className="dash-kpi-sub">{totalStock.toLocaleString()} units in stock</div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-top">
                  <span className="dash-kpi-label">Customers</span>
                  <div className="dash-kpi-icon" style={{ background: "#f0fdf4" }}>👥</div>
                </div>
                <div className="dash-kpi-value">{customerCount}</div>
                <div className="dash-kpi-sub">registered accounts</div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-top">
                  <span className="dash-kpi-label">Inventory value</span>
                  <div className="dash-kpi-icon" style={{ background: "#fef9c3" }}>💰</div>
                </div>
                <div className="dash-kpi-value">
                  ${totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="dash-kpi-sub">avg ${avgPrice.toFixed(2)} per item</div>
              </div>

              <div className="dash-kpi-card">
                <div className="dash-kpi-top">
                  <span className="dash-kpi-label">Low stock alerts</span>
                  <div className="dash-kpi-icon" style={{ background: "#fef2f2" }}>⚠️</div>
                </div>
                <div className="dash-kpi-value" style={{ color: lowStockItems.length > 0 ? "#ef4444" : "#111827" }}>
                  {lowStockItems.length}
                </div>
                <div className={`dash-kpi-sub${lowStockItems.length > 0 ? " warn" : ""}`}>
                  {lowStockItems.length > 0 ? "items need restocking" : "all items well stocked"}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="dash-charts-grid">

              <div className="dash-chart-card">
                <div className="dash-chart-header">
                  <div className="dash-chart-title">Top items by value</div>
                  <div className="dash-chart-sub">price × quantity</div>
                </div>
                <div className="dash-chart-body">
                  {topByValue.length === 0 ? (
                    <div className="empty-chart">
                      <div className="empty-chart-icon">📊</div>
                      <div className="empty-chart-label">No items to display</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={topByValue} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={40}>
                          {topByValue.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="dash-chart-card">
                <div className="dash-chart-header">
                  <div className="dash-chart-title">Stock health</div>
                  <div className="dash-chart-sub">by quantity bracket</div>
                </div>
                <div className="dash-chart-body">
                  {stockBuckets.length === 0 ? (
                    <div className="empty-chart">
                      <div className="empty-chart-icon">🥧</div>
                      <div className="empty-chart-label">No items to display</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={stockBuckets} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={42} paddingAngle={3} stroke="none">
                          {stockBuckets.map((b, i) => <Cell key={i} fill={b.fill} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v} items`, ""]} contentStyle={{ fontFamily: "Geist, system-ui", fontSize: 13, borderRadius: 10, border: "1px solid #e9eaec" }} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom grid */}
            <div className="dash-bottom-grid">

              {/* Low stock table */}
              <div className="dash-table-card">
                <div className="dash-table-header">
                  <span className="dash-table-title">⚠️ Low stock items</span>
                  {lowStockItems.length > 0 && (
                    <span className="dash-alert-badge">{lowStockItems.length} alert{lowStockItems.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
                {lowStockItems.length === 0 ? (
                  <div className="no-low-stock">✅ All items have healthy stock levels</div>
                ) : (
                  <table className="dash-inner-table">
                    <thead>
                      <tr><th>Item</th><th>Price</th><th>Qty</th></tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 500, color: "#111827" }}>{item.name}</td>
                          <td style={{ color: "#6b7280" }}>${Number(item.price).toFixed(2)}</td>
                          <td>
                            <span className={`qty-chip ${item.quantity === 0 ? "red" : "orange"}`}>
                              {item.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quick actions */}
              <div className="dash-quick-card">
                <div className="dash-quick-title">Quick actions</div>

                <button className="dash-quick-btn" onClick={() => setIsModalOpen(true)}>
                  <div className="dash-quick-btn-icon" style={{ background: "#eff6ff" }}>📦</div>
                  <div>
                    <div className="dash-quick-btn-label">Add new item</div>
                    <div className="dash-quick-btn-sub">Add a product to inventory</div>
                  </div>
                </button>

                <button className="dash-quick-btn" onClick={() => navigate("/customers")}>
                  <div className="dash-quick-btn-icon" style={{ background: "#f0fdf4" }}>👤</div>
                  <div>
                    <div className="dash-quick-btn-label">Manage customers</div>
                    <div className="dash-quick-btn-sub">{customerCount} registered customer{customerCount !== 1 ? "s" : ""}</div>
                  </div>
                </button>

                <button className="dash-quick-btn" onClick={() => navigate("/transaction")}>
                  <div className="dash-quick-btn-icon" style={{ background: "#fdf4ff" }}>🛒</div>
                  <div>
                    <div className="dash-quick-btn-label">New transaction</div>
                    <div className="dash-quick-btn-sub">Create a sales order</div>
                  </div>
                </button>

                <button className="dash-quick-btn" onClick={() => navigate("/history")}>
                  <div className="dash-quick-btn-icon" style={{ background: "#fff7ed" }}>🧾</div>
                  <div>
                    <div className="dash-quick-btn-label">Order history</div>
                    <div className="dash-quick-btn-sub">View past transactions</div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemCount={items.length}
        onAdd={async (item) => {
          const promise = addItem(item);
          toast.promise(promise, {
            loading: "Adding item...",
            success: "Item added successfully 🥂",
            error: "Failed to add item ❌",
          });
          await promise;
          setIsModalOpen(false);
          loadData();
        }}
      />
    </>
  );
};

export default Home;
