import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/intro" },
  { label: "Activities", path: "/activities" },
  { label: "Gallery", path: "/gallery" },
  { label: "NSS Units", path: "/nssunits" },
  { label: "Reports", path: "/reports" },
  { label: "Notifications", path: "/notifications" },
  { label: "Contact", path: "/contact" },
  { label: "Login", path: "/officer/login" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-950 text-white sticky top-0 z-40 shadow-md">
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-center space-x-8 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `relative font-medium transition-colors duration-300 ${
                isActive
                  ? "text-yellow-400"
                  : "hover:text-blue-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.label}
                {/* Underline Animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden flex justify-between items-center px-6 py-3">
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-900 px-6 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between py-3 border-b border-blue-800 transition-colors ${
                  isActive
                    ? "text-yellow-400"
                    : "hover:text-blue-300"
                }`
              }
            >
              {item.label}
              <ChevronRight size={16} />
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}