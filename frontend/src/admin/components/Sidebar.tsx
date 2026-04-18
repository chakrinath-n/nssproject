import {
  LayoutDashboard,
  Megaphone,
  ChevronLeft,
  LogOut,
  FileText,
  Image,
  CalendarCheck,
  Building2,
  BarChart3,
  Shield,
  GraduationCap,
  Trophy, // ✅ ADD
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "About", path: "/admin/about" },
  { icon: Image, label: "Images", path: "/admin/images" },
  { icon: CalendarCheck, label: "Activities", path: "/admin/activities" },
  { icon: Building2, label: "NSS Units", path: "/admin/nssunits" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Trophy, label: "Awards", path: "/admin/awards" }, // ✅ ADD
  { icon: Shield, label: "Admins", path: "/admin/admins" },
  { icon: Megaphone, label: "Notifications", path: "/admin/notifications" },
  
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-navy z-40 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
        <div
          className={`flex items-center gap-3 overflow-hidden ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          } transition-all duration-300`}
        >
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-gold" />
          </div>
          <div className="whitespace-nowrap">
            <h1 className="text-white font-display text-lg tracking-tight">
              NSS
            </h1>
            <p className="text-gold/70 text-xs tracking-widest uppercase">
              Admin
            </p>
          </div>
        </div>

        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mx-auto">
            <GraduationCap className="w-5 h-5 text-gold" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold rounded-r-full" />
                    )}

                    <item.icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-gold" : "group-hover:text-white"
                      }`}
                    />

                    <span
                      className={`font-medium whitespace-nowrap transition-all duration-300 ${
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>

                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-navy-light rounded-lg text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-navy-light rotate-45" />
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group relative"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`font-medium whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Sign Out
          </span>
        </button>

        <button
          onClick={onToggle}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
          <span
            className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}