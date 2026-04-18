import { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Loader2,
  Search,
  Calendar,
} from "lucide-react";
import { getActivities } from "@/api/public";

/* ================= TYPES ================= */

interface ActivityType {
  id: number;
  name: string;
  description: string;
  category: string | null;
  created_at: string;
}

type ApiActivity = {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  category?: string | null;
  created_at?: string;
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities();

        const mapped: ActivityType[] = response.data.map(
          (a: ApiActivity) => ({
            id: a.id,
            name: a.name || a.title || "Untitled Activity",
            description: a.description || "No description available",
            category: a.category || "General",
            created_at:
              a.created_at || new Date().toISOString(),
          })
        );

        setActivities(mapped);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  /* ================= TYPES ================= */

  const activityTypes = useMemo(() => {
    return Array.from(
      new Set(
        activities.map((a) => a.category).filter(Boolean)
      )
    );
  }, [activities]);

  /* ================= YEARS ================= */

  const years = useMemo(() => {
    return Array.from(
      new Set(
        activities.map((a) =>
          new Date(a.created_at).getFullYear().toString()
        )
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [activities]);

  /* ================= FILTER ================= */

  const filteredActivities = useMemo(() => {
    const filtered = activities.filter((activity) => {
      const matchesSearch = activity.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" ||
        activity.category === selectedType;

      const activityYear = new Date(activity.created_at)
        .getFullYear()
        .toString();

      const matchesYear =
        selectedYear === "all" ||
        activityYear === selectedYear;

      return matchesSearch && matchesType && matchesYear;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [
    activities,
    searchQuery,
    selectedType,
    selectedYear,
    sortOrder,
  ]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="flex justify-center items-center min-h-75">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 to-indigo-50">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Our <span className="text-blue-600">Activities</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto">
          Explore impactful programs, camps, and initiatives organized under NSS.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-10 grid md:grid-cols-4 gap-4">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* CATEGORY */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
        >
          <option value="all">All Types</option>
          {activityTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        {/* YEAR */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
        >
          <option value="all">All Years</option>
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>

        {/* SORT */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200 shadow-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activity.name}
                </h3>

                {activity.category && (
                  <span className="inline-block mb-2 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {activity.category}
                  </span>
                )}

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {activity.description}
                </p>

                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(activity.created_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}