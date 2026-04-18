import {
  Shield,
  Megaphone,
  Calendar,
  Image,
  FileText,
  Activity,
  Layers,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "@/api/axios";

interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  last_login?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentAdmins, setRecentAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          adminsRes,
          notificationsRes,
          unitsRes,
          reportsRes,
          activitiesRes,
          imagesRes,
        ] = await Promise.all([
          axios.get("/admins"),
          axios.get("/notifications"),
          axios.get("/nss-units"),
          axios.get("/reports"),
          axios.get("/activities"),
          axios.get("/images"),
        ]);

        setStats([
          {
            title: "Total Units",
            value: unitsRes.data.length,
            icon: Layers,
            color: "bg-blue-500",
          },
          {
            title: "Total Reports",
            value: reportsRes.data.length,
            icon: FileText,
            color: "bg-emerald-500",
          },
          {
            title: "Total Activities",
            value: activitiesRes.data.length,
            icon: Activity,
            color: "bg-orange-500",
          },
          {
            title: "Total Notifications",
            value: notificationsRes.data.length,
            icon: Megaphone,
            color: "bg-violet-500",
          },
          {
            title: "Total Images",
            value: imagesRes.data.length,
            icon: Image,
            color: "bg-pink-500",
          },
          {
            title: "Total Admins",
            value: adminsRes.data.length,
            icon: Shield,
            color: "bg-indigo-500",
          },
          
        ]);

        const sortedAdmins = [...adminsRes.data]
          .sort(
            (a, b) =>
              new Date(b.last_login || 0).getTime() -
              new Date(a.last_login || 0).getTime()
          )
          .slice(0, 5);

        setRecentAdmins(sortedAdmins);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-navy">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Overview of your CMS activity
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <h3 className="text-3xl font-display text-navy">
              {loading ? "..." : stat.value}
            </h3>
            <p className="text-slate-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Recent Admin Logins */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-display text-navy">
            Recent Admin Logins
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {recentAdmins.map((admin) => (
            <div key={admin.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-navy font-medium">{admin.name}</p>
                  <p className="text-slate-500 text-sm">{admin.email}</p>
                </div>
                <span className="text-slate-400 text-xs">
                  {admin.last_login
                    ? new Date(admin.last_login).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          ))}

          {recentAdmins.length === 0 && !loading && (
            <div className="p-6 text-center text-slate-500 text-sm">
              No recent admin activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}