import { useState } from "react";
import api from "@/api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Unit {
  id: number;
  college_name: string;
  nss_unit_code: string;
}

interface Volunteer {
  id: number;
  hallticket_no: string;
  aadhaar_number: string;
  student_name: string;
  father_name: string;
  dob: string;
  course: string;
  year: number;
  semester: number;
  gender: string;
  blood_group: string;
  category: string;
  entry_date: string;
  photo: string;
}

interface Stats {
  total: number;
  male: number;
  female: number;
  sc: number;
  st: number;
  bc: number;
  others: number;
}

interface VolunteerData {
  unit: Unit;
  volunteers: Volunteer[];
  stats: Stats;
}

type ExcelRow = {
  "S.No": number | string;
  "Hall Ticket No": string;
  "Aadhaar No": string;
  "Student Name": string;
  "Father Name": string;
  "D.O.B": string;
  "Course": string;
  "Year": number | string;
  "Semester": number | string;
  "Gender": string;
  "Blood Group": string;
  "Category": string;
  "Year of Joining": string;
};

export default function UnitVolunteersPage() {

  const [unitCode, setUnitCode] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [data, setData] = useState<VolunteerData | null>(null);
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
        `/officer/public/volunteers/unit/${unitCode.trim()}${yearParam}`
      );
      setData(res.data);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Unit not found");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    date ? new Date(date).toISOString().slice(0, 10) : "—";

  const getPrefix = (gender: string) =>
    gender === "Female" ? "Ms." : "Mr.";

  const getRelation = (gender: string) =>
    gender === "Female" ? "D/o." : "S/o.";

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    if (!data) return;

    const rows: ExcelRow[] = data.volunteers.map((v, index) => ({
      "S.No": index + 1,
      "Hall Ticket No": v.hallticket_no || "—",
      "Aadhaar No": v.aadhaar_number || "—",
      "Student Name": `${getPrefix(v.gender)} ${v.student_name?.toUpperCase()}`,
      "Father Name": `${getRelation(v.gender)} ${v.father_name?.toUpperCase()}`,
      "D.O.B": formatDate(v.dob),
      "Course": v.course,
      "Year": v.year,
      "Semester": v.semester,
      "Gender": v.gender,
      "Blood Group": v.blood_group || "—",
      "Category": v.category || "—",
      "Year of Joining": formatDate(v.entry_date),
    }));

    // Add stats row at bottom
    rows.push({
      "S.No": "",
      "Hall Ticket No": `Total: ${data.stats.total}`,
      "Aadhaar No": `Male: ${data.stats.male}`,
      "Student Name": `Female: ${data.stats.female}`,
      "Father Name": `SC: ${data.stats.sc}`,
      "D.O.B": `ST: ${data.stats.st}`,
      "Course": `BC: ${data.stats.bc}`,
      "Year": "",
      "Semester": "",
      "Gender": `Others: ${data.stats.others}`,
      "Blood Group": "",
      "Category": "",
      "Year of Joining": "",
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Volunteers");

    const fileName = `NSS_Volunteers_${data.unit.nss_unit_code}${selectedYear ? `_${selectedYear}` : ""}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: "landscape" });

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("JNTUK NSS Volunteers", doc.internal.pageSize.width / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `NSS Unit Code: ${data.unit.nss_unit_code} — ${data.unit.college_name}`,
      doc.internal.pageSize.width / 2, 22, { align: "center" }
    );

    if (selectedYear) {
      doc.text(
        `Year: ${selectedYear}-${Number(selectedYear) + 1}`,
        doc.internal.pageSize.width / 2, 28, { align: "center" }
      );
    }

    // Table
    autoTable(doc, {
      startY: selectedYear ? 33 : 28,
      head: [[
        "S.No", "HT No / Aadhaar", "Student Name / Father Name",
        "D.O.B", "Class", "Gender", "Blood Group", "Category", "Year of Joining"
      ]],
      body: data.volunteers.map((v, index) => [
        index + 1,
        `${v.hallticket_no || "—"}\n${v.aadhaar_number || "—"}`,
        `${getPrefix(v.gender)} ${v.student_name?.toUpperCase()}\n${getRelation(v.gender)} ${v.father_name?.toUpperCase()}`,
        formatDate(v.dob),
        `${v.course} ${v.year} Sem ${v.semester}`,
        v.gender,
        v.blood_group || "—",
        v.category || "—",
        formatDate(v.entry_date),
      ]),
      foot: [[
        "",
        `Total: ${data.stats.total}`,
        `Male: ${data.stats.male} | Female: ${data.stats.female}`,
        "",
        "",
        "",
        `SC: ${data.stats.sc} | ST: ${data.stats.st}`,
        `BC: ${data.stats.bc} | Others: ${data.stats.others}`,
        "",
      ]],
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [15, 25, 35], textColor: 255 },
      footStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    const fileName = `NSS_Volunteers_${data.unit.nss_unit_code}${selectedYear ? `_${selectedYear}` : ""}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-950 text-white py-10 text-center">
        <h1 className="text-3xl font-bold">NSS Volunteers</h1>
        <p className="text-blue-300 mt-2 text-sm">
          View unit-wise volunteer details — JNTUK NSS Portal
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ===== SEARCH FORM ===== */}
        <div className="bg-white rounded-xl shadow p-8 mb-8 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            View Unitwise Volunteer Details
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

            {/* Title + Download Buttons */}
            <div className="text-center py-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                JNTUK NSS Volunteers
                {selectedYear ? ` for ${selectedYear}-${Number(selectedYear) + 1}` : ""}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                NSS Unit Code: <strong>{data.unit.nss_unit_code}</strong>
              </p>

              {/* Download Buttons */}
              {data.volunteers.length > 0 && (
                <div className="flex justify-center gap-3 mt-4">
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
              )}
            </div>

            {/* Empty */}
            {data.volunteers.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No volunteers found for this unit{selectedYear ? ` in ${selectedYear}` : ""}.
              </p>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-3 text-left">S. No</th>
                        <th className="border px-3 py-3 text-left">
                          JNTUK HT No<br />Aadhaar No
                        </th>
                        <th className="border px-3 py-3 text-left">
                          Student Name<br />Fathers Name
                        </th>
                        <th className="border px-3 py-3 text-left">D.O.B.</th>
                        <th className="border px-3 py-3 text-left">Class</th>
                        <th className="border px-3 py-3 text-left">Gender</th>
                        <th className="border px-3 py-3 text-left">Blood Group</th>
                        <th className="border px-3 py-3 text-left">Category</th>
                        <th className="border px-3 py-3 text-left">Year of Joining</th>
                        <th className="border px-3 py-3 text-left">Photo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.volunteers.map((v, index) => (
                        <tr
                          key={v.id}
                          className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <td className="border px-3 py-3">{index + 1}</td>
                          <td className="border px-3 py-3">
                            <div>{v.hallticket_no || "—"}</div>
                            <div className="text-gray-500">{v.aadhaar_number || "—"}</div>
                          </td>
                          <td className="border px-3 py-3">
                            <div className="font-medium">
                              {getPrefix(v.gender)} {v.student_name?.toUpperCase()}
                            </div>
                            <div className="text-gray-500">
                              {getRelation(v.gender)} {v.father_name?.toUpperCase()}
                            </div>
                          </td>
                          <td className="border px-3 py-3">{formatDate(v.dob)}</td>
                          <td className="border px-3 py-3">
                            {v.course} {v.year} Sem {v.semester}
                          </td>
                          <td className="border px-3 py-3">{v.gender}</td>
                          <td className="border px-3 py-3">{v.blood_group || "—"}</td>
                          <td className="border px-3 py-3">{v.category || "—"}</td>
                          <td className="border px-3 py-3">{formatDate(v.entry_date)}</td>
                          <td className="border px-3 py-3">
                            {v.photo ? (
                              <img
                                src={`http://localhost:5000/uploads/${v.photo}`}
                                className="w-12 h-14 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                No Photo
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ===== STATS FOOTER ===== */}
                <div className="px-6 py-4 border-t text-sm text-center text-gray-700">
                  <span className="font-medium">Total: </span>
                  <strong>{data.stats.total}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">Male: </span>
                  <strong>{data.stats.male}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">Female: </span>
                  <strong>{data.stats.female}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">SC: </span>
                  <strong>{data.stats.sc}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">ST: </span>
                  <strong>{data.stats.st}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">BC: </span>
                  <strong>{data.stats.bc}</strong>
                  <span className="mx-3">|</span>
                  <span className="font-medium">Others: </span>
                  <strong>{data.stats.others}</strong>
                </div>

              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}