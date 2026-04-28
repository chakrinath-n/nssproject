import { useEffect, useState, useMemo } from "react";
import {
  Megaphone,
  Loader2,
  Search,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import api from "@/api/axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

interface Notification {
  id: number;
  title: string;
  link?: string | null;
  file?: string | null;
  category?: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/public");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get unique years
  const years = useMemo(() => {
    const yearSet = new Set(
      notifications.map((n) =>
        new Date(n.created_at).getFullYear().toString()
      )
    );
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [notifications]);

  // ✅ Filter + Search + Sort
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter((item) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      const itemYear = new Date(item.created_at)
        .getFullYear()
        .toString();

      const matchesYear =
        selectedYear === "all" || itemYear === selectedYear;

      return matchesSearch && matchesYear;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

    return filtered;
  }, [notifications, searchQuery, selectedYear, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            Notifications
          </h1>
          <p className="text-blue-700">
            Latest announcements and updates
          </p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-blue-200">
            <Megaphone className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-600">
              No notifications match your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((item) => {
              const openUrl = item.file
                ? `${BASE_URL}/uploads/notifications/${item.file}`
                : item.link || null;

              const Wrapper: any = openUrl ? "a" : "div";

              return (
                <Wrapper
                  key={item.id}
                  href={openUrl || undefined}
                  target={openUrl ? "_blank" : undefined}
                  rel={openUrl ? "noopener noreferrer" : undefined}
                  className="block bg-white rounded-xl border border-blue-200 p-6 hover:shadow-lg hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-blue-900 font-semibold">
                        {item.title}
                      </h3>

                      <p className="text-blue-500 text-sm mt-1">
                        {new Date(item.created_at).toLocaleDateString("en-IN")}
                      </p>

                      {item.category && (
                        <span className="inline-block mt-3 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}