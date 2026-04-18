import { Outlet, NavLink, useNavigate, useLocation, } from "react-router-dom";
import { useState } from "react";
import {
  ChevronDown, ChevronRight, Home, Users, ClipboardList,
  Tent, Link2, KeyRound, LogOut  // ✅ Link renamed to Link2
} from "lucide-react";

export default function OfficerLayout() {

  const [volunteerMenu, setVolunteerMenu] = useState(false);
  const [activityMenu, setActivityMenu] = useState(false);
  const [specialCampMenu, setSpecialCampMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
  localStorage.removeItem("officer_token");
  navigate("/officer/login", { replace: true });
};

  const isVolunteerActive = location.pathname.includes("/officer/volunteers");
  const isActivityActive = location.pathname.includes("/officer/regular-report") ||
    location.pathname.includes("/officer/activity-details");
  const isCampActive = location.pathname.includes("/officer/special-camp");

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-[#0f1923] text-white flex flex-col shadow-xl">

        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <h2 className="text-base font-bold tracking-wide text-white">
            NSS Officer Panel
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">JNTUK Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">

          {/* HOME */}
          <NavLink
            to="/officer/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Home size={16} />
            Home
          </NavLink>

          {/* ===== VOLUNTEERS ===== */}
          <div>
            <button
              onClick={() => setVolunteerMenu(!volunteerMenu)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                isVolunteerActive
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>Volunteers Information</span>
              </div>
              {volunteerMenu ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {volunteerMenu && (
              <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                <NavLink
                  to="/officer/volunteers/add"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-green-400 font-medium bg-green-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  Add Volunteer
                </NavLink>
                <NavLink
                  to="/officer/volunteers"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-green-400 font-medium bg-green-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  View Volunteers
                </NavLink>
              </div>
            )}
          </div>

          {/* ===== REGULAR ACTIVITY REPORTS ===== */}
          <div>
            <button
              onClick={() => setActivityMenu(!activityMenu)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                isActivityActive
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={16} />
                <span>Regular Activity Reports</span>
              </div>
              {activityMenu ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {activityMenu && (
              <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                {[
                  { id: 1, name: "Blood Donation" },
                  { id: 2, name: "Plantation of Saplings" },
                  { id: 3, name: "Pulse Polio Campaign" },
                  { id: 4, name: "Water Harvesting Pits" },
                  { id: 5, name: "Swachh Bharat" },
                  { id: 6, name: "Pre-Republic Day" },
                  { id: 7, name: "Other Activity" },
                ].map((item) => (
                  <NavLink
                    key={item.id}
                    to={`/officer/regular-report/${item.id}`}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? "text-green-400 font-medium bg-green-400/10"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                <NavLink
                  to="/officer/activity-details"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-green-400 font-medium bg-green-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  View Activity Details
                </NavLink>
              </div>
            )}
          </div>

          {/* ===== SPECIAL CAMPS ===== */}
          <div>
            <button
              onClick={() => setSpecialCampMenu(!specialCampMenu)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                isCampActive
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Tent size={16} />
                <span>Special Camps Reports</span>
              </div>
              {specialCampMenu ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {specialCampMenu && (
              <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                <NavLink
                  to="/officer/special-camp/add"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-green-400 font-medium bg-green-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  Add Camp Report
                </NavLink>
                <NavLink
                  to="/officer/special-camp/view"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? "text-green-400 font-medium bg-green-400/10"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  View Camp Reports
                </NavLink>
              </div>
            )}
          </div>


          

          {/* SOCIAL LINKS */}
          <NavLink
            to="/officer/social"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Link2 size={16} /> {/* ✅ Link2 from lucide */}
            Social Links
          </NavLink>

          {/* CHANGE PASSWORD */}
          <NavLink
            to="/officer/change-password"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <KeyRound size={16} />
            Change Password
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}