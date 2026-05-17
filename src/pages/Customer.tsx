import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { Customer } from "../types/customer";
import { addCustomer, deleteCustomer, getCustomers } from "../services/customerService";
import toast from "react-hot-toast";
import AddCustomerModal from "../components/AddCustomerModal";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleAdd = () => setIsModalOpen(true);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.telPhone.includes(searchQuery)
  );

  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>Delete this customer?</span>
          <span style={{ fontSize: 13, color: "#6b7280" }}>This action cannot be undone.</span>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              style={{
                background: "#ef4444", color: "#fff", border: "none",
                padding: "6px 16px", borderRadius: 8, cursor: "pointer",
                fontSize: 13, fontWeight: 500,
              }}
              onClick={async () => {
                setDeletingId(id);
                await deleteCustomer(id);
                await loadCustomers();
                setDeletingId(null);
                toast.dismiss(t.id);
                toast.success("Customer deleted");
              }}
            >
              Delete
            </button>
            <button
              style={{
                background: "#f3f4f6", color: "#374151", border: "none",
                padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
              }}
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  // Generate a consistent avatar color from name
  const avatarColor = (name: string) => {
    const colors = [
      { bg: "#eff6ff", text: "#3b82f6" },
      { bg: "#f0fdf4", text: "#16a34a" },
      { bg: "#fdf4ff", text: "#a855f7" },
      { bg: "#fff7ed", text: "#f97316" },
      { bg: "#fdf2f8", text: "#ec4899" },
      { bg: "#f0fdfa", text: "#14b8a6" },
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');

        .cust-root {
          font-family: 'Geist', system-ui, sans-serif;
          min-height: calc(100vh - 70px);
          background: #f8f9fb;
          padding: 28px 32px;
          box-sizing: border-box;
        }

        /* ── Stat cards ── */
        .cust-stat-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .cust-stat-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cust-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .cust-stat-icon.blue  { background: #eff6ff; }
        .cust-stat-icon.purple { background: #fdf4ff; }
        .cust-stat-icon.teal  { background: #f0fdfa; }
        .cust-stat-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .cust-stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
        }

        /* ── Toolbar ── */
        .cust-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cust-toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cust-page-title {
          font-size: 19px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .cust-count-badge {
          background: #f3f4f6;
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
        }
        .cust-search-wrap {
          position: relative;
          flex: 1;
          max-width: 280px;
        }
        .cust-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          font-size: 14px;
        }
        .cust-search-input {
          width: 100%;
          padding: 8px 12px 8px 34px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          font-size: 13.5px;
          color: #111827;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cust-search-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .cust-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .cust-add-btn:hover  { background: #1e40af; }
        .cust-add-btn:active { transform: scale(0.98); }

        /* ── Table card ── */
        .cust-table-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 16px;
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cust-table-scroll {
          overflow-y: auto;
          flex: 1;
        }
        .cust-table-card table {
          width: 100%;
          border-collapse: collapse;
        }
        .cust-table-card thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .cust-table-card thead tr {
          background: #fff;
          border-bottom: 1.5px solid #e9eaec;
        }
        .cust-table-card th {
          padding: 13px 18px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .cust-table-card td {
          padding: 14px 18px;
          font-size: 14px;
          color: #374151;
          vertical-align: middle;
        }
        .cust-table-card tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.1s;
        }
        .cust-table-card tbody tr:last-child { border-bottom: none; }
        .cust-table-card tbody tr:hover { background: #fafafa; }
        .cust-table-card tbody tr.deleting { opacity: 0.4; pointer-events: none; }

        .cust-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cust-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .cust-name {
          font-weight: 500;
          color: #111827;
        }

        .cust-address {
          color: #6b7280;
          font-size: 13px;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cust-address:hover {
          white-space: normal;
          overflow: visible;
        }

        .cust-phone {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #374151;
          font-variant-numeric: tabular-nums;
        }

        .cust-del-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .cust-del-btn:hover {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #ef4444;
        }
        .cust-del-btn:active { transform: scale(0.97); }

        .cust-empty-state {
          padding: 72px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .cust-empty-icon  { font-size: 36px; margin-bottom: 4px; }
        .cust-empty-title { font-size: 15px; font-weight: 600; color: #374151; }
        .cust-empty-sub   { font-size: 13px; color: #9ca3af; }

        .cust-table-footer {
          padding: 12px 18px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cust-footer-text { font-size: 12.5px; color: #9ca3af; }

        @media (max-width: 640px) {
          .cust-root { padding: 16px; }
          .cust-stat-cards { grid-template-columns: 1fr; }
          .cust-search-wrap { max-width: 100%; }
        }
      `}</style>

      <Navbar />

      <div className="cust-root">

        {/* ── Stat cards ── */}
        <div className="cust-stat-cards">
          <div className="cust-stat-card">
            <div className="cust-stat-icon blue">👥</div>
            <div>
              <div className="cust-stat-label">Total customers</div>
              <div className="cust-stat-value">{customers.length}</div>
            </div>
          </div>
          <div className="cust-stat-card">
            <div className="cust-stat-icon purple">🏙️</div>
            <div>
              <div className="cust-stat-label">Unique cities</div>
              <div className="cust-stat-value">
                {new Set(customers.map((c) => c.address.split(",").pop()?.trim())).size}
              </div>
            </div>
          </div>
          <div className="cust-stat-card">
            <div className="cust-stat-icon teal">📞</div>
            <div>
              <div className="cust-stat-label">With phone</div>
              <div className="cust-stat-value">
                {customers.filter((c) => c.telPhone).length}
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="cust-toolbar">
          <div className="cust-toolbar-left">
            <h1 className="cust-page-title">Customers</h1>
            {searchQuery && (
              <span className="cust-count-badge">
                {filteredCustomers.length} of {customers.length}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="cust-search-wrap">
              <span className="cust-search-icon">🔍</span>
              <input
                className="cust-search-input"
                type="text"
                placeholder="Search name, address, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="cust-add-btn" onClick={handleAdd}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              Add customer
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="cust-table-card">
          <div className="cust-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const color = avatarColor(customer.name);
                  return (
                    <tr
                      key={customer.id}
                      className={deletingId === customer.id ? "deleting" : ""}
                    >
                      <td>
                        <div className="cust-name-cell">
                          <div
                            className="cust-avatar"
                            style={{ background: color.bg, color: color.text }}
                          >
                            {customer.name.charAt(0)}
                          </div>
                          <span className="cust-name">{customer.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="cust-address" title={customer.address}>
                          {customer.address}
                        </span>
                      </td>
                      <td>
                        <span className="cust-phone">
                          📞 {customer.telPhone}
                        </span>
                      </td>
                      <td>
                        <button
                          className="cust-del-btn"
                          onClick={() => handleDelete(customer.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="cust-empty-state">
                        <div className="cust-empty-icon">
                          {searchQuery ? "🔍" : "👤"}
                        </div>
                        <div className="cust-empty-title">
                          {searchQuery
                            ? `No customers matching "${searchQuery}"`
                            : "No customers yet"}
                        </div>
                        <div className="cust-empty-sub">
                          {searchQuery
                            ? "Try searching by name, address, or phone"
                            : "Add your first customer to get started"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {customers.length > 0 && (
            <div className="cust-table-footer">
              <span className="cust-footer-text">
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}
                {searchQuery ? " found" : " total"}
              </span>
              <span className="cust-footer-text">Last updated just now</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerCount={customers.length}
        onAdd={async (customer: any) => {
          await addCustomer(customer);
          await loadCustomers();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default CustomerPage;
