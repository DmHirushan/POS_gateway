import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard",  to: "/",            icon: "📊" },
  { label: "Items",      to: "/Items",        icon: "📦" },
  { label: "Customers",  to: "/Customer",     icon: "👥" },
  { label: "Place Order",to: "/Transaction",  icon: "🛒" },
  { label: "History",    to: "/history",      icon: "🧾" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap');

        .nb-root {
          font-family: 'Geist', system-ui, sans-serif;
          background: #fff;
          border-bottom: 1px solid #e9eaec;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nb-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 60px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Brand ── */
        .nb-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }
        .nb-brand-icon {
          width: 30px; height: 30px;
          background: #1d4ed8;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .nb-brand-name {
          font-size: 15px; font-weight: 600;
          color: #111827; letter-spacing: -0.02em;
        }
        .nb-brand-dot { color: #1d4ed8; }

        /* ── Desktop links ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nb-link {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13.5px; font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .nb-link:hover { background: #f3f4f6; color: #111827; }
        .nb-link.active {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .nb-link-icon { font-size: 14px; opacity: 0.8; }

        /* ── Right side ── */
        .nb-right {
          display: flex; align-items: center; gap: 10px;
        }
        .nb-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #1d4ed8;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* ── Mobile toggle ── */
        .nb-mobile-toggle {
          display: none;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 36px; height: 36px;
          align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 16px;
          color: #374151;
          transition: background 0.12s;
        }
        .nb-mobile-toggle:hover { background: #f3f4f6; }

        /* ── Mobile drawer ── */
        .nb-mobile-menu {
          display: none;
          flex-direction: column;
          padding: 10px 16px 14px;
          border-top: 1px solid #f3f4f6;
          gap: 2px;
        }
        .nb-mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 14px; font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .nb-mobile-link:hover  { background: #f3f4f6; color: #111827; }
        .nb-mobile-link.active { background: #eff6ff; color: #1d4ed8; }
        .nb-mobile-link-icon   { font-size: 16px; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nb-links         { display: none; }
          .nb-mobile-toggle { display: flex; }
        }
        @media (min-width: 769px) {
          .nb-mobile-menu { display: none !important; }
        }
        .nb-mobile-menu.open { display: flex; }
      `}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Brand */}
          <Link to="/" className="nb-brand">
            <div className="nb-brand-icon">🏪</div>
            <span className="nb-brand-name">
              Store<span className="nb-brand-dot">Admin</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="nb-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nb-link${isActive(link.to) ? " active" : ""}`}
                >
                  <span className="nb-link-icon">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: avatar + mobile toggle */}
          <div className="nb-right">
            <div className="nb-avatar" title="Admin">A</div>
            <button
              className="nb-mobile-toggle"
              onClick={() => setIsOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile-menu${isOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nb-mobile-link${isActive(link.to) ? " active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="nb-mobile-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
