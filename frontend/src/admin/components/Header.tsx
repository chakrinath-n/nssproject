import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

interface Admin {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({
  onMenuClick,
  isMobileMenuOpen,
}: HeaderProps) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const [admin] = useState<Admin | null>(() => {
    const adminData = localStorage.getItem("admin");
    return adminData ? JSON.parse(adminData) : null;
  });

  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const getInitials = () => {
    if (admin?.name) {
      return admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (admin?.email) {
      return admin.email.slice(0, 2).toUpperCase();
    }
    return "AD";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-600" />
          ) : (
            <Menu className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* ✅ Center Welcome Note (Added) */}
      <div className="hidden md:block text-navy font-semibold text-lg">
        Welcome to NSS Admin Panel
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="hidden sm:block text-right">
              <p className="text-navy font-medium text-sm">
                {admin?.name || "Admin"}
              </p>
              <p className="text-slate-500 text-xs capitalize">
                {admin?.role || "Administrator"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <p className="text-navy font-medium">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-slate-500 text-sm">
                  {admin?.email || ""}
                </p>
              </div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}