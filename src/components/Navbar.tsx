import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">P O S</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li>
            <a href="/Home" className="hover:text-gray-300">
              Dashboard
            </a>
          </li>
          <li>
            <Link to="/Items" className="hover:text-gray-300">
              Items
            </Link>
          </li>
          <li>
            <a href="/Customer" className="hover:text-gray-300">
              Customers
            </a>
          </li>
          <li>
            <a href="/Transaction" className="hover:text-gray-300">
              Place Order
            </a>
          </li>
          <li>
            <a href="/history" className="hover:text-gray-300">
              History
            </a>
          </li>
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-2">
          <li>
            <a href="#" className="block hover:text-gray-300">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-gray-300">
              About
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-gray-300">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="block hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
