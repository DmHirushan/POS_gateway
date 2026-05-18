import { useState } from "react";
import type { Item } from "../types/item";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  onAdd: (item: Omit<Item, "id">) => void;
};

const AddItemModal = ({ isOpen, onClose, itemCount, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{ name?: string; price?: string; quantity?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim())          e.name     = "Item name is required";
    if (!price)                e.price    = "Price is required";
    else if (Number(price) < 0) e.price   = "Price must be positive";
    if (!quantity)             e.quantity = "Quantity is required";
    else if (Number(quantity) < 0) e.quantity = "Quantity must be positive";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    onAdd({ name: name.trim(), price: Number(price), quantity: Number(quantity) });

    setName(""); setPrice(""); setQuantity(""); setErrors({});
    onClose();
  };

  const handleClose = () => {
    setName(""); setPrice(""); setQuantity(""); setErrors({});
    onClose();
  };

  const previewTotal = price && quantity ? (Number(price) * Number(quantity)).toFixed(2) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

        .aim-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(3px);
          z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: aim-fade-in 0.15s ease;
        }
        @keyframes aim-fade-in { from { opacity: 0 } to { opacity: 1 } }

        .aim-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);
          font-family: 'Geist', system-ui, sans-serif;
          animation: aim-slide-up 0.18s ease;
          overflow: hidden;
        }
        @keyframes aim-slide-up { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }

        /* ── Header ── */
        .aim-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; justify-content: space-between;
        }
        .aim-header-left { display: flex; align-items: center; gap: 10px; }
        .aim-header-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #eff6ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }
        .aim-title {
          font-size: 15px; font-weight: 600;
          color: #111827; letter-spacing: -0.01em;
          margin: 0;
        }
        .aim-sub {
          font-size: 12px; color: #9ca3af; margin-top: 1px;
        }
        .aim-close-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1px solid #e5e7eb; background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #6b7280; cursor: pointer;
          transition: background 0.12s;
        }
        .aim-close-btn:hover { background: #f3f4f6; color: #111827; }

        /* ── Body ── */
        .aim-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }

        /* Auto ID field */
        .aim-id-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 13px;
          background: #f8f9fb;
          border: 1px solid #e9eaec;
          border-radius: 10px;
        }
        .aim-id-label {
          font-size: 12px; font-weight: 500; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .aim-id-value {
          font-size: 13.5px; font-weight: 600;
          color: #374151; font-variant-numeric: tabular-nums;
        }
        .aim-id-badge {
          margin-left: auto;
          font-size: 11px; background: #e0e7ff; color: #4338ca;
          border-radius: 999px; padding: 2px 8px; font-weight: 500;
        }

        /* Field group */
        .aim-field { display: flex; flex-direction: column; gap: 5px; }
        .aim-label {
          font-size: 12px; font-weight: 600; color: #374151;
          letter-spacing: 0.01em;
        }
        .aim-input-wrap { position: relative; }
        .aim-prefix {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; color: #9ca3af; pointer-events: none;
        }
        .aim-input {
          width: 100%; padding: 10px 13px;
          border: 1px solid #e5e7eb; border-radius: 10px;
          background: #fff; font-size: 13.5px; color: #111827;
          font-family: inherit; outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .aim-input.has-prefix { padding-left: 26px; }
        .aim-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .aim-input.error { border-color: #fca5a5; }
        .aim-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .aim-error {
          font-size: 11.5px; color: #ef4444; display: flex; align-items: center; gap: 4px;
        }

        /* Price + Qty side by side */
        .aim-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Preview total */
        .aim-preview {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px;
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
        }
        .aim-preview-label { font-size: 12.5px; color: #15803d; font-weight: 500; }
        .aim-preview-value { font-size: 15px; font-weight: 700; color: #16a34a; letter-spacing: -0.02em; }

        /* ── Footer ── */
        .aim-footer {
          padding: 16px 24px 20px;
          border-top: 1px solid #f3f4f6;
          display: flex; gap: 10px; justify-content: flex-end;
        }
        .aim-cancel-btn {
          padding: 9px 18px; border-radius: 10px;
          border: 1px solid #e5e7eb; background: #fff;
          font-size: 13.5px; font-weight: 500; color: #374151;
          cursor: pointer; font-family: inherit;
          transition: background 0.12s, border-color 0.12s;
        }
        .aim-cancel-btn:hover { background: #f3f4f6; border-color: #d1d5db; }

        .aim-submit-btn {
          padding: 9px 22px; border-radius: 10px;
          border: none; background: #1d4ed8; color: #fff;
          font-size: 13.5px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.15s, transform 0.1s;
        }
        .aim-submit-btn:hover  { background: #1e40af; }
        .aim-submit-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="aim-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="aim-modal">

          {/* Header */}
          <div className="aim-header">
            <div className="aim-header-left">
              <div className="aim-header-icon">📦</div>
              <div>
                <p className="aim-title">Add new item</p>
                <p className="aim-sub">Fill in the details below</p>
              </div>
            </div>
            <button className="aim-close-btn" onClick={handleClose}>✕</button>
          </div>

          {/* Body */}
          <div className="aim-body">

            {/* Auto ID */}
            <div className="aim-id-row">
              <span className="aim-id-label">Item ID</span>
              <span className="aim-id-value">#{itemCount + 1}</span>
              <span className="aim-id-badge">Auto-assigned</span>
            </div>

            {/* Name */}
            <div className="aim-field">
              <label className="aim-label">Item name</label>
              <input
                className={`aim-input${errors.name ? " error" : ""}`}
                type="text"
                placeholder="e.g. Wireless Mouse"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              />
              {errors.name && <span className="aim-error">⚠ {errors.name}</span>}
            </div>

            {/* Price + Qty */}
            <div className="aim-row">
              <div className="aim-field">
                <label className="aim-label">Price</label>
                <div className="aim-input-wrap">
                  <span className="aim-prefix">$</span>
                  <input
                    className={`aim-input has-prefix${errors.price ? " error" : ""}`}
                    type="number"
                    placeholder="0.00"
                    min={0}
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: undefined })); }}
                  />
                </div>
                {errors.price && <span className="aim-error">⚠ {errors.price}</span>}
              </div>

              <div className="aim-field">
                <label className="aim-label">Quantity</label>
                <input
                  className={`aim-input${errors.quantity ? " error" : ""}`}
                  type="number"
                  placeholder="0"
                  min={0}
                  value={quantity}
                  onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: undefined })); }}
                />
                {errors.quantity && <span className="aim-error">⚠ {errors.quantity}</span>}
              </div>
            </div>

            {/* Live total preview */}
            {previewTotal && (
              <div className="aim-preview">
                <span className="aim-preview-label">📊 Inventory value</span>
                <span className="aim-preview-value">${previewTotal}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="aim-footer">
            <button className="aim-cancel-btn" onClick={handleClose}>Cancel</button>
            <button className="aim-submit-btn" onClick={handleSubmit}>
              <span style={{ fontSize: 15 }}>+</span> Add item
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddItemModal;
