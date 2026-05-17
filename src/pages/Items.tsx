import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getItems, deleteItem, addItem } from "../services/itemService";
import type { Item } from "../types/item";
import AddItemModal from "../components/PopUp";
import toast from "react-hot-toast";

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (e) {
      console.log("Error loading items ", e);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontWeight: 500, fontSize: 14 }}>
            Delete this item?
          </span>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            This action cannot be undone.
          </span>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "6px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
              onClick={async () => {
                setDeletingId(id);
                await deleteItem(id);
                await loadItems();
                setDeletingId(null);
                toast.dismiss(t.id);
                toast.success("Item deleted");
              }}
            >
              Delete
            </button>
            <button
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                padding: "6px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
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

  const handleAdd = () => setIsModalOpen(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap');

        .items-root {
          font-family: 'Geist', system-ui, sans-serif;
          min-height: calc(100vh - 70px);
          background: #f8f9fb;
          padding: 28px 32px;
          box-sizing: border-box;
        }

        /* ── Stat cards ── */
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .stat-icon.blue  { background: #eff6ff; }
        .stat-icon.green { background: #f0fdf4; }
        .stat-icon.amber { background: #fffbeb; }
        .stat-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
        }

        /* ── Toolbar ── */
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .page-title {
          font-size: 19px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .item-count-badge {
          background: #f3f4f6;
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
        }
        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          font-size: 14px;
        }
        .search-input {
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
        .search-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .add-btn {
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
        .add-btn:hover  { background: #1e40af; }
        .add-btn:active { transform: scale(0.98); }

        /* ── Table card ── */
        .table-card {
          background: #fff;
          border: 1px solid #e9eaec;
          border-radius: 16px;
          overflow: hidden;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .table-scroll {
          overflow-y: auto;
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        thead tr {
          background: #fff;
          border-bottom: 1.5px solid #e9eaec;
        }
        th {
          padding: 13px 18px;
          text-align: left;
          font-size: 11.5px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        td {
          padding: 14px 18px;
          font-size: 14px;
          color: #374151;
          vertical-align: middle;
        }
        tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.1s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }
        tbody tr.deleting { opacity: 0.4; pointer-events: none; }

        .item-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .item-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #3b82f6;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .item-name {
          font-weight: 500;
          color: #111827;
        }

        .price-cell {
          font-weight: 600;
          color: #111827;
          font-variant-numeric: tabular-nums;
        }

        .qty-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 22px;
          padding: 0 8px;
          border-radius: 6px;
          font-size: 12.5px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .qty-badge.low  { background: #fef2f2; color: #ef4444; }
        .qty-badge.mid  { background: #fffbeb; color: #d97706; }
        .qty-badge.good { background: #f0fdf4; color: #16a34a; }

        .del-btn {
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
        .del-btn:hover {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #ef4444;
        }
        .del-btn:active { transform: scale(0.97); }

        .empty-state {
          padding: 72px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-icon {
          font-size: 36px;
          margin-bottom: 4px;
        }
        .empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #374151;
        }
        .empty-sub {
          font-size: 13px;
          color: #9ca3af;
        }

        .table-footer {
          padding: 12px 18px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-text {
          font-size: 12.5px;
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .items-root { padding: 16px; }
          .stat-cards { grid-template-columns: 1fr; }
          .search-wrap { max-width: 100%; }
        }
      `}</style>

      <Navbar />

      <div className="items-root">

        {/* ── Stat cards ── */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-icon blue">📦</div>
            <div>
              <div className="stat-label">Total SKUs</div>
              <div className="stat-value">{items.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🔢</div>
            <div>
              <div className="stat-label">Units in stock</div>
              <div className="stat-value">{totalItems.toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">💰</div>
            <div>
              <div className="stat-label">Inventory value</div>
              <div className="stat-value">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="toolbar-left">
            <h1 className="page-title">Inventory</h1>
            {searchQuery && (
              <span className="item-count-badge">
                {filteredItems.length} of {items.length}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="add-btn" onClick={handleAdd}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              Add item
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const qtyClass =
                    item.quantity <= 5
                      ? "low"
                      : item.quantity <= 20
                      ? "mid"
                      : "good";
                  return (
                    <tr
                      key={item.id}
                      className={deletingId === item.id ? "deleting" : ""}
                    >
                      <td>
                        <div className="item-name-cell">
                          <div className="item-avatar">
                            {item.name.charAt(0)}
                          </div>
                          <span className="item-name">{item.name}</span>
                        </div>
                      </td>
                      <td className="price-cell">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td>
                        <span className={`qty-badge ${qtyClass}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={{ color: "#6b7280", fontSize: 13 }}>
                        ${(item.price * item.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <button
                          className="del-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon">
                          {searchQuery ? "🔍" : "📭"}
                        </div>
                        <div className="empty-title">
                          {searchQuery
                            ? `No items matching "${searchQuery}"`
                            : "No items yet"}
                        </div>
                        <div className="empty-sub">
                          {searchQuery
                            ? "Try a different search term"
                            : "Add your first item to get started"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="table-footer">
              <span className="footer-text">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                {searchQuery ? " found" : " total"}
              </span>
              <span className="footer-text">
                Last updated just now
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
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
          await loadItems();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default Items;
