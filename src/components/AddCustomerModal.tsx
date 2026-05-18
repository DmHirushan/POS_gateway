import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: { id: number; name: string; address: string; telPhone: string }) => void;
  customerCount: number;
};

const AddCustomerModal = ({ isOpen, onClose, onAdd, customerCount }: Props) => {
  const [name, setName]         = useState("");
  const [address, setAddress]   = useState("");
  const [telPhone, setTelPhone] = useState("");
  const [errors, setErrors]     = useState<{ name?: string; address?: string; telPhone?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim())     e.name     = "Customer name is required";
    if (!address.trim())  e.address  = "Address is required";
    if (!telPhone.trim()) e.telPhone = "Phone number is required";
    else if (!/^[\d\s\+\-\(\)]{6,}$/.test(telPhone)) e.telPhone = "Enter a valid phone number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    onAdd({ id: customerCount + 1, name: name.trim(), address: address.trim(), telPhone: telPhone.trim() });

    setName(""); setAddress(""); setTelPhone(""); setErrors({});
    onClose();
  };

  const handleClose = () => {
    setName(""); setAddress(""); setTelPhone(""); setErrors({});
    onClose();
  };

  // Avatar preview colour from first letter
  const avatarColors = [
    { bg: "#eff6ff", text: "#3b82f6" },
    { bg: "#f0fdf4", text: "#16a34a" },
    { bg: "#fdf4ff", text: "#a855f7" },
    { bg: "#fff7ed", text: "#f97316" },
    { bg: "#fdf2f8", text: "#ec4899" },
    { bg: "#f0fdfa", text: "#14b8a6" },
  ];
  const avatarColor = name
    ? avatarColors[name.charCodeAt(0) % avatarColors.length]
    : { bg: "#f3f4f6", text: "#9ca3af" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

        .acm-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(3px);
          z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: acm-fade-in 0.15s ease;
        }
        @keyframes acm-fade-in { from { opacity: 0 } to { opacity: 1 } }

        .acm-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08);
          font-family: 'Geist', system-ui, sans-serif;
          animation: acm-slide-up 0.18s ease;
          overflow: hidden;
        }
        @keyframes acm-slide-up {
          from { opacity: 0; transform: translateY(10px) }
          to   { opacity: 1; transform: translateY(0) }
        }

        /* ── Header ── */
        .acm-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; justify-content: space-between;
        }
        .acm-header-left { display: flex; align-items: center; gap: 10px; }
        .acm-header-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f0fdf4;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
        }
        .acm-title {
          font-size: 15px; font-weight: 600;
          color: #111827; letter-spacing: -0.01em; margin: 0;
        }
        .acm-sub { font-size: 12px; color: #9ca3af; margin-top: 1px; }

        .acm-close-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1px solid #e5e7eb; background: transparent;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #6b7280; cursor: pointer;
          transition: background 0.12s;
        }
        .acm-close-btn:hover { background: #f3f4f6; color: #111827; }

        /* ── Body ── */
        .acm-body {
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 14px;
        }

        /* Avatar preview */
        .acm-preview-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          background: #f8f9fb;
          border: 1px solid #e9eaec;
          border-radius: 10px;
        }
        .acm-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 600;
          flex-shrink: 0; text-transform: uppercase;
          transition: background 0.2s, color 0.2s;
        }
        .acm-preview-info { flex: 1; min-width: 0; }
        .acm-preview-name {
          font-size: 13.5px; font-weight: 500; color: #111827;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .acm-preview-id {
          font-size: 11.5px; color: #9ca3af; margin-top: 1px;
        }
        .acm-id-badge {
          font-size: 11px; background: #e0e7ff; color: #4338ca;
          border-radius: 999px; padding: 2px 9px; font-weight: 500;
          flex-shrink: 0;
        }

        /* Fields */
        .acm-field { display: flex; flex-direction: column; gap: 5px; }
        .acm-label { font-size: 12px; font-weight: 600; color: #374151; }

        .acm-input-wrap { position: relative; }
        .acm-input-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          font-size: 14px; pointer-events: none;
          opacity: 0.5;
        }
        .acm-input {
          width: 100%; padding: 10px 13px 10px 36px;
          border: 1px solid #e5e7eb; border-radius: 10px;
          background: #fff; font-size: 13.5px; color: #111827;
          font-family: inherit; outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .acm-input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .acm-input.error { border-color: #fca5a5; }
        .acm-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
        .acm-error {
          font-size: 11.5px; color: #ef4444;
          display: flex; align-items: center; gap: 4px;
        }

        /* ── Footer ── */
        .acm-footer {
          padding: 16px 24px 20px;
          border-top: 1px solid #f3f4f6;
          display: flex; gap: 10px; justify-content: flex-end;
        }
        .acm-cancel-btn {
          padding: 9px 18px; border-radius: 10px;
          border: 1px solid #e5e7eb; background: #fff;
          font-size: 13.5px; font-weight: 500; color: #374151;
          cursor: pointer; font-family: inherit;
          transition: background 0.12s, border-color 0.12s;
        }
        .acm-cancel-btn:hover { background: #f3f4f6; border-color: #d1d5db; }

        .acm-submit-btn {
          padding: 9px 22px; border-radius: 10px;
          border: none; background: #16a34a; color: #fff;
          font-size: 13.5px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.15s, transform 0.1s;
        }
        .acm-submit-btn:hover  { background: #15803d; }
        .acm-submit-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="acm-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="acm-modal">

          {/* Header */}
          <div className="acm-header">
            <div className="acm-header-left">
              <div className="acm-header-icon">👤</div>
              <div>
                <p className="acm-title">Add new customer</p>
                <p className="acm-sub">Fill in the customer details</p>
              </div>
            </div>
            <button className="acm-close-btn" onClick={handleClose}>✕</button>
          </div>

          {/* Body */}
          <div className="acm-body">

            {/* Live avatar preview */}
            <div className="acm-preview-row">
              <div
                className="acm-avatar"
                style={{ background: avatarColor.bg, color: avatarColor.text }}
              >
                {name ? name.charAt(0) : "?"}
              </div>
              <div className="acm-preview-info">
                <div className="acm-preview-name">
                  {name.trim() || <span style={{ color: "#9ca3af", fontWeight: 400 }}>Customer name</span>}
                </div>
                <div className="acm-preview-id">ID #{customerCount + 1}</div>
              </div>
              <span className="acm-id-badge">Auto-assigned</span>
            </div>

            {/* Name */}
            <div className="acm-field">
              <label className="acm-label">Full name</label>
              <div className="acm-input-wrap">
                <span className="acm-input-icon">👤</span>
                <input
                  className={`acm-input${errors.name ? " error" : ""}`}
                  type="text"
                  placeholder="e.g. Kamal Perera"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                />
              </div>
              {errors.name && <span className="acm-error">⚠ {errors.name}</span>}
            </div>

            {/* Address */}
            <div className="acm-field">
              <label className="acm-label">Address</label>
              <div className="acm-input-wrap">
                <span className="acm-input-icon">📍</span>
                <input
                  className={`acm-input${errors.address ? " error" : ""}`}
                  type="text"
                  placeholder="e.g. 42 Galle Rd, Colombo"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                />
              </div>
              {errors.address && <span className="acm-error">⚠ {errors.address}</span>}
            </div>

            {/* Phone */}
            <div className="acm-field">
              <label className="acm-label">Phone number</label>
              <div className="acm-input-wrap">
                <span className="acm-input-icon">📞</span>
                <input
                  className={`acm-input${errors.telPhone ? " error" : ""}`}
                  type="tel"
                  placeholder="e.g. +94 77 123 4567"
                  value={telPhone}
                  onChange={(e) => { setTelPhone(e.target.value); setErrors((p) => ({ ...p, telPhone: undefined })); }}
                />
              </div>
              {errors.telPhone && <span className="acm-error">⚠ {errors.telPhone}</span>}
            </div>

          </div>

          {/* Footer */}
          <div className="acm-footer">
            <button className="acm-cancel-btn" onClick={handleClose}>Cancel</button>
            <button className="acm-submit-btn" onClick={handleSubmit}>
              <span style={{ fontSize: 15 }}>+</span> Add customer
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddCustomerModal;
