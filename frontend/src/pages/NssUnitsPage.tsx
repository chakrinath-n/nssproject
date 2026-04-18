import { useEffect, useState, useMemo } from "react";
import { School, Loader2, MapPin, Mail } from "lucide-react";
import { getNssUnits, type NssUnit } from "@/api/public";

export default function NssUnitsPage() {
  const [units, setUnits] = useState<NssUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await getNssUnits();
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching NSS units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  /* ================= DERIVED ================= */

  const districts = useMemo(() => {
    return Array.from(new Set(units.map((u) => u.district))).sort();
  }, [units]);

  const years = useMemo(() => {
    return Array.from(
      new Set(
        units.map((u) =>
          new Date(u.created_at).getFullYear().toString()
        )
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [units]);

  // ✅ Stats
  const totalUnits = units.length;
  const totalDistricts = districts.length;
  const latestYear = years[0] || "N/A";

  /* ================= FILTER ================= */

  const filteredUnits = useMemo(() => {
    const filtered = units.filter((unit) => {
      const matchesSearch =
        unit.college_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.district.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDistrict =
        selectedDistrict === "all" || unit.district === selectedDistrict;

      const year = new Date(unit.created_at).getFullYear().toString();

      const matchesYear =
        selectedYear === "all" || year === selectedYear;

      return matchesSearch && matchesDistrict && matchesYear;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [units, searchQuery, selectedDistrict, selectedYear, sortOrder]);

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
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          NSS <span className="text-blue-600">Units</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Explore all registered NSS units under JNTUK
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-2xl font-bold text-blue-600">{totalUnits}</h3>
          <p className="text-gray-500 text-sm">Total Units</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-2xl font-bold text-green-600">{totalDistricts}</h3>
          <p className="text-gray-500 text-sm">Districts</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-2xl font-bold text-purple-600">{latestYear}</h3>
          <p className="text-gray-500 text-sm">Latest Year</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-10 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search college or district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200"
        />

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200"
        >
          <option value="all">All Districts</option>
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-200"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredUnits.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <School className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No units found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {unit.college_name}
                </h3>

                <p className="text-sm text-gray-600">
                  <strong>District:</strong> {unit.district}
                </p>

                <p className="text-sm text-gray-600">
                  <strong>Unit Code:</strong> {unit.nss_unit_code}
                </p>

                {unit.college_code && (
                  <p className="text-sm text-gray-600">
                    <strong>College Code:</strong> {unit.college_code}
                  </p>
                )}

                {unit.unit_type && (
                  <p className="text-sm text-gray-600">
                    <strong>Unit Type:</strong> {unit.unit_type}
                  </p>
                )}

                {unit.programme_officer && (
                  <p className="text-sm text-gray-600">
                    <strong>Officer:</strong> {unit.programme_officer}
                  </p>
                )}

                {unit.officer_email && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {unit.officer_email}
                  </p>
                )}

                {unit.adopted_village && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {unit.adopted_village}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-4">
                  Added on{" "}
                  {new Date(unit.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}