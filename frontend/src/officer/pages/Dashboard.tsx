import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Users, Activity, TentTree, MapPin, Mail, Phone,
  BadgeCheck, Droplets, BookOpen, GraduationCap,
  Building2, Globe, Home
} from "lucide-react";

interface OfficerInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
  aadhaar: string;
  blood_group: string;
  teaching_subject: string;
  experience: string;
  eti_status: string;
  nss_unit_code: string;
  college_name: string;
  district: string;
  unit_type: string;
  state: string;
  block: string;
  university_name: string;
  college_address: string;
  college_phone: string;
  college_email: string;
  adopted_village: string;
  profile_image: string;
}

interface RecentActivity {
  activity_name: string;
  event_date: string;
  activity_type_name: string;
}

interface DashboardData {
  officer: OfficerInfo;
  totalActivities: number;
  totalSpecialCamps: number;
  totalVolunteers: number;
  recentActivities: RecentActivity[];
}

export default function Dashboard() {

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/officer/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load dashboard.</div>;

  const stats = [
    {
      label: "Total Volunteers",
      value: data.totalVolunteers,
      icon: <Users size={28} className="text-blue-500" />,
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Total Activities",
      value: data.totalActivities,
      icon: <Activity size={28} className="text-green-500" />,
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      label: "Special Camp Reports",
      value: data.totalSpecialCamps,
      icon: <TentTree size={28} className="text-orange-500" />,
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  ];

  const o = data.officer;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">Officer Dashboard</h1>

      {/* ===== OFFICER PROFILE CARD ===== */}
      <div className="bg-white rounded-xl shadow p-6">

        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-6">
          {o.profile_image ? (
            <img
              src={`http://localhost:5000/uploads/${o.profile_image}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-green-200 shadow"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold shadow">
              {o.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-800">{o.name}</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Program Officer
            </span>
            {o.phone && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <Phone size={13} />
                <span>{o.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== PROGRAMME OFFICER DETAILS ===== */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-2">
            Programme Officer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeCheck size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Name:</span>
              <span>{o.name || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Email:</span>
              <span className="truncate">{o.email || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Mobile:</span>
              <span>{o.phone || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Gender:</span>
              <span>{o.gender || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Droplets size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Blood Group:</span>
              <span>{o.blood_group || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeCheck size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Aadhaar:</span>
              <span>{o.aadhaar || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Teaching Subject:</span>
              <span>{o.teaching_subject || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Experience:</span>
              <span>{o.experience || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeCheck size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">ETI Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                o.eti_status === "Trained"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {o.eti_status || "—"}
              </span>
            </div>

          </div>
        </div>

        {/* ===== COLLEGE / UNIT DETAILS ===== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b pb-2">
            College / Unit Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeCheck size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">NSS Unit Code:</span>
              <span>{o.nss_unit_code || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeCheck size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Unit Type:</span>
              <span>{o.unit_type || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">State:</span>
              <span>{o.state || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">District:</span>
              <span>{o.district || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Block:</span>
              <span>{o.block || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">University:</span>
              <span className="truncate">{o.university_name || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
              <Building2 size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">College:</span>
              <span className="truncate">{o.college_name || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">College Email:</span>
              <span className="truncate">{o.college_email || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">College Phone:</span>
              <span>{o.college_phone || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
              <Home size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Address:</span>
              <span>{o.college_address || "—"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} className="text-green-600 shrink-0" />
              <span className="font-medium">Adopted Village:</span>
              <span>{o.adopted_village || "—"}</span>
            </div>

          </div>
        </div>

      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} ${stat.border} border rounded-xl p-6 flex items-center gap-4 shadow-sm`}
          >
            <div className="p-3 bg-white rounded-full shadow">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== RECENT ACTIVITIES ===== */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Recent Activities
        </h2>

        {data.recentActivities.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No activities yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 text-left">#</th>
                  <th className="border px-3 py-2 text-left">Activity Name</th>
                  <th className="border px-3 py-2 text-left">Type</th>
                  <th className="border px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivities.map((a, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2 font-medium">{a.activity_name}</td>
                    <td className="border px-3 py-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {a.activity_type_name || "—"}
                      </span>
                    </td>
                    <td className="border px-3 py-2">
                      {a.event_date?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}