import { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Loader2,
  Search,
  Download,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import api from "@/api/axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

interface Report {
  id: number;
  report_id: string;
  name: string;
  description?: string;
  file_url?: string;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= YEARS ================= */

  const years = useMemo(() => {
    const yearSet = new Set(
      reports.map((r) =>
        new Date(r.created_at).getFullYear().toString()
      )
    );
    return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
  }, [reports]);

  /* ================= FILTER ================= */

  const filteredReports = useMemo(() => {
    const filtered = reports.filter((report) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        report.name?.toLowerCase().includes(query) ||
        report.report_id?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query);

      const reportYear = new Date(report.created_at)
        .getFullYear()
        .toString();

      const matchesYear =
        selectedYear === "all" || reportYear === selectedYear;

      return matchesSearch && matchesYear;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [reports, searchQuery, selectedYear, sortOrder]);

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

      {/* HEADER (NO BADGE) */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          NSS <span className="text-blue-600">Reports</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Access reports, activity summaries, and official documents.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-10 grid md:grid-cols-3 gap-4">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* YEAR */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reports found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const fileLink = report.file_url
                ? report.file_url.startsWith("http")
                  ? report.file_url
                  : `${BASE_URL}${report.file_url}`
                : null;

              return (
                <div
                  key={report.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    <strong>ID:</strong> {report.report_id}
                  </p>

                  {report.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {report.description}
                    </p>
                  )}

                  {fileLink && (
                    <a
                      href={fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    {new Date(report.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}