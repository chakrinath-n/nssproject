import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Unit {
  id: number;
  college_name: string;
  nss_unit_code: string;
}

interface Activity {
  id: number;
  activity_name: string;
  activity_type_name: string;
  event_date: string;
  end_date: string;
  volunteers_count: number;
  location: string;
  college_name: string;
  nss_unit_code: string;
}

interface ActivityData {
  unit: Unit;
  activities: Activity[];
}

type ExcelRow = {
  "S.No": number;
  "Start Date": string;
  "End Date": string;
  "Type of Activity": string;
  "Name of Activity": string;
  "Volunteers Count": number | string;
  "Location": string;
  "Organized By": string;
};

export default function ActivitiesPage() {
  const navigate = useNavigate();

  const [unitCode, setUnitCode] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitCode.trim()) return setError("Please enter NSS Unit Code");

    setError("");
    setLoading(true);
    setSubmitted(false);

    try {
      const yearParam = selectedYear ? `?year=${selectedYear}` : "";
      const res = await api.get(
        `/officer/public/activities/unit/${unitCode.trim()}${yearParam}`
      );
      setData(res.data);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Unit not found");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "—";

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    if (!data) return;

    const rows: ExcelRow[] = data.activities.map((a, index) => ({
      "S.No": index + 1,
      "Start Date": formatDate(a.event_date),
      "End Date": formatDate(a.end_date),
      "Type of Activity": a.activity_type_name || "—",
      "Name of Activity": a.activity_name,
      "Volunteers Count": a.volunteers_count ?? "—",
      "Location": a.location || "—",
      "Organized By": `${data.unit.nss_unit_code} - ${data.unit.college_name}`,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths
    ws["!cols"] = [
      { wch: 6 },
      { wch: 12 },
      { wch: 12 },
      { wch: 25 },
      { wch: 35 },
      { wch: 18 },
      { wch: 25 },
      { wch: 45 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activities");

    const fileName = `NSS_Activities_${data.unit.nss_unit_code}${selectedYear ? `_${selectedYear}` : ""}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "landscape" });

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "NSS Activities Conducted by JNTUK",
      doc.internal.pageSize.width / 2,
      15,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Unit Code: ${data.unit.nss_unit_code} — ${data.unit.college_name}`,
      doc.internal.pageSize.width / 2,
      22,
      { align: "center" }
    );

    if (selectedYear) {
      doc.text(
        `Year: ${selectedYear}-${Number(selectedYear) + 1}`,
        doc.internal.pageSize.width / 2,
        28,
        { align: "center" }
      );
    }

    // Table
    autoTable(doc, {
      startY: selectedYear ? 33 : 28,
      head: [[
        "S.No",
        "Start Date",
        "End Date",
        "Type of Activity",
        "Name of Activity",
        "Volunteers",
        "Location",
        "Organized By",
      ]],
      body: data.activities.map((a, index) => [
        index + 1,
        formatDate(a.event_date),
        formatDate(a.end_date),
        a.activity_type_name || "—",
        a.activity_name,
        a.volunteers_count ?? "—",
        a.location || "—",
        `${data.unit.nss_unit_code} - ${data.unit.college_name}`,
      ]),
      foot: [[
        "",
        "",
        "",
        "",
        `Total Activities: ${data.activities.length}`,
        `Total Volunteers: ${data.activities.reduce((sum, a) => sum + (a.volunteers_count || 0), 0)}`,
        "",
        "",
      ]],
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [15, 25, 35], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        4: { cellWidth: 50 },
        7: { cellWidth: 50 },
      },
    });

    const fileName = `NSS_Activities_${data.unit.nss_unit_code}${selectedYear ? `_${selectedYear}` : ""}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-950 text-white py-10 text-center">
        <h1 className="text-3xl font-bold">NSS Activities</h1>
        <p className="text-blue-300 mt-2 text-sm">
          View unit-wise activity details — JNTUK NSS Portal
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ===== SEARCH FORM ===== */}
        <div className="bg-white rounded-xl shadow p-8 mb-8 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            View Unitwise Activity Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                NSS Unit Code
              </label>
              <input
                type="text"
                value={unitCode}
                onChange={(e) => setUnitCode(e.target.value)}
                placeholder="e.g. 1122"
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Filter by Year (optional)
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}-{y + 1}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm">❌ {error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white py-2.5 rounded-lg font-medium transition"
            >
              {loading ? "Searching..." : "Submit"}
            </button>

          </form>
        </div>

        {/* ===== RESULTS ===== */}
        {submitted && data && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* Unit Header */}
            <div className="bg-blue-950 text-white px-6 py-4 text-center">
              <h2 className="text-lg font-bold">
                NSS Activities Conducted by Unit No: {data.unit.nss_unit_code} of JNTUK
                {selectedYear ? ` during ${selectedYear}-${Number(selectedYear) + 1}` : ""}
              </h2>
              <p className="text-blue-300 text-sm mt-1">{data.unit.college_name}</p>
            </div>

            {data.activities.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No activities found for this unit{selectedYear ? ` in ${selectedYear}` : ""}.
              </p>
            ) : (
              <>
                {/* ===== DOWNLOAD BUTTONS ===== */}
                <div className="flex justify-center gap-3 py-4 border-b">
                  <button
                    onClick={downloadExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ⬇️ Download Excel
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ⬇️ Download PDF
                  </button>
                </div>

                {/* ===== TABLE ===== */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-3 text-left">S. No</th>
                        <th className="border px-3 py-3 text-left">Start Date</th>
                        <th className="border px-3 py-3 text-left">End Date</th>
                        <th className="border px-3 py-3 text-left">Type of the Activity</th>
                        <th className="border px-3 py-3 text-left">Name of the Activity</th>
                        <th className="border px-3 py-3 text-left">Volunteers</th>
                        <th className="border px-3 py-3 text-left">Location</th>
                        <th className="border px-3 py-3 text-left">Organized By</th>
                        <th className="border px-3 py-3 text-left">View More</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.activities.map((a, index) => (
                        <tr key={a.id} className="border-b hover:bg-gray-50">

                          <td className="border px-3 py-3">{index + 1}</td>

                          <td className="border px-3 py-3">{formatDate(a.event_date)}</td>

                          <td className="border px-3 py-3">{formatDate(a.end_date)}</td>

                          <td className="border px-3 py-3">{a.activity_type_name || "—"}</td>

                          <td className="border px-3 py-3 font-medium">{a.activity_name}</td>

                          <td className="border px-3 py-3 text-center">
                            {a.volunteers_count ?? "—"}
                          </td>

                          <td className="border px-3 py-3 text-gray-600">
                            {a.location || "—"}
                          </td>

                          <td className="border px-3 py-3 text-gray-600 max-w-xs">
                            {data.unit.nss_unit_code} - {data.unit.college_name}
                          </td>

                          <td className="border px-3 py-3">
                            <button
                              onClick={() => navigate(`/unit-activities/${a.id}`)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                            >
                              View
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                    {/* ===== TABLE FOOTER STATS ===== */}
                    <tfoot>
                      <tr className="bg-gray-100 font-semibold text-gray-700">
                        <td className="border px-3 py-3" colSpan={5}>
                          Total Activities: {data.activities.length}
                        </td>
                        <td className="border px-3 py-3 text-center">
                          {data.activities.reduce((sum, a) => sum + (a.volunteers_count || 0), 0)}
                        </td>
                        <td className="border px-3 py-3" colSpan={3}></td>
                      </tr>
                    </tfoot>

                  </table>
                </div>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}