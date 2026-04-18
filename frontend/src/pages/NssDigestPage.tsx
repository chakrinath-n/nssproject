import { useEffect, useState, useCallback } from "react";
import api from "@/api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface College {
  id: number;
  college_name: string;
  nss_unit_code: string;
}

interface VolunteerStats {
  total: number;
  male: number;
  female: number;
  sc: number;
  st: number;
  bc: number;
  oc: number;
}

interface ActivityStat {
  type_name: string;
  count: number;
  total_volunteers: number;
}

interface CampStats {
  total: number;
  male: number;
  female: number;
}

interface DigestData {
  volunteers: VolunteerStats;
  activities: ActivityStat[];
  totalActivities: number;
  camps: CampStats;
  colleges: College[];
}

const ACTIVITY_TYPES = [
  { key: "Blood Donation",         label: "Blood Donation",         programLabel: "No. of Blood Donation camps:",                  volLabel: "No. of Volunteers participated:" },
  { key: "Plantation of Saplings", label: "Plantation of Saplings", programLabel: "No. of Plantation programmes:",                 volLabel: "No. of Volunteers involved:"     },
  { key: "Swachh Bharat",          label: "Swachh Bharat",          programLabel: "No. of Swachh Bharat programmes conducted:",    volLabel: "No. of Volunteers involved:"     },
  { key: "Water Harvesting Pits",  label: "Water Harvesting Pits",  programLabel: "No. of Water Harvesting programmes conducted:", volLabel: "No. of Volunteers involved:"     },
  { key: "Pre-Republic Day",       label: "Pre-Republic Day",       programLabel: "No. of Pre-RD programmes attended:",           volLabel: "No. of Volunteers participated:" },
  { key: "Pulse Polio Campaign",   label: "Pulse Polio Campaign",   programLabel: "No. of Pulse Polio programmes attended:",      volLabel: "No. of Volunteers participated:" },
  { key: "Other Activity",         label: "Other Activities",       programLabel: "No. of other programmes conducted:",           volLabel: "No. of Volunteers participated:" },
];

export default function NssDigestPage() {

  const [data, setData]                       = useState<DigestData | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedYear, setSelectedYear]       = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const fetchDigest = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCollege) params.append("college_id", selectedCollege);
      if (selectedYear)    params.append("year", selectedYear);
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get(`/nss-digest${query}`);
      setData(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCollege, selectedYear]);

  useEffect(() => {
    fetchDigest();
  }, [fetchDigest]);

  const selectedCollegeName = data?.colleges.find(
    (c) => String(c.id) === selectedCollege
  )?.college_name || "All Colleges";

  const getActivityCount = (typeName: string) =>
    data?.activities.find((a) => a.type_name === typeName)?.count || 0;

  const getActivityVolunteers = (typeName: string) =>
    data?.activities.find((a) => a.type_name === typeName)?.total_volunteers || 0;

  const yearLabel = selectedYear
    ? `${selectedYear}-${Number(selectedYear) + 1}`
    : "All Years";

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    if (!data) return;

    const rows: { "Category": string; "Description": string; "Count": number | string }[] = [];

    rows.push({ "Category": "NSS Volunteers", "Description": "Total Volunteers",  "Count": data.volunteers.total  });
    rows.push({ "Category": "",               "Description": "Male",              "Count": data.volunteers.male   });
    rows.push({ "Category": "",               "Description": "Female",            "Count": data.volunteers.female });
    rows.push({ "Category": "",               "Description": "SC",                "Count": data.volunteers.sc     });
    rows.push({ "Category": "",               "Description": "ST",                "Count": data.volunteers.st     });
    rows.push({ "Category": "",               "Description": "BC",                "Count": data.volunteers.bc     });
    rows.push({ "Category": "",               "Description": "OC",                "Count": data.volunteers.oc     });
    rows.push({ "Category": "",               "Description": "",                  "Count": ""                     });

    rows.push({ "Category": "Activities", "Description": "Total No. of Activities", "Count": data.totalActivities });
    rows.push({ "Category": "",           "Description": "",                         "Count": ""                   });

    rows.push({ "Category": "Special Camps", "Description": "No. of Special Camps conducted",        "Count": data.camps.total  });
    rows.push({ "Category": "",              "Description": "No. of male volunteers participated",   "Count": data.camps.male   });
    rows.push({ "Category": "",              "Description": "No. of female volunteers participated", "Count": data.camps.female });
    rows.push({ "Category": "",              "Description": "",                                       "Count": ""                });

    ACTIVITY_TYPES.forEach((type) => {
      rows.push({ "Category": type.label, "Description": type.programLabel, "Count": getActivityCount(type.key)      });
      rows.push({ "Category": "",          "Description": type.volLabel,     "Count": getActivityVolunteers(type.key) });
      rows.push({ "Category": "",          "Description": "",                "Count": ""                              });
    });

    const sheetData = [
      ["JNTUK NSS Statistics"],
      [`College: ${selectedCollegeName}  |  Year: ${yearLabel}`],
      [],
      ["Category", "Description", "Count"],
      ...rows.map((r) => [r["Category"], r["Description"], r["Count"]]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = [{ wch: 28 }, { wch: 52 }, { wch: 12 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NSS Digest");

    const fileName = `NSS_Digest_${selectedCollege ? selectedCollegeName.replace(/\s+/g, "_") : "All"}${selectedYear ? `_${selectedYear}` : ""}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("JNTUK NSS Statistics", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`College: ${selectedCollegeName}`, pageWidth / 2, 22, { align: "center" });
    doc.text(`Year: ${yearLabel}`, pageWidth / 2, 27, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("NSS Volunteers Summary", 14, 35);

    autoTable(doc, {
      startY: 38,
      head: [["Total", "Male", "Female", "SC", "ST", "BC", "OC"]],
      body: [[
        data.volunteers.total,
        data.volunteers.male,
        data.volunteers.female,
        data.volunteers.sc,
        data.volunteers.st,
        data.volunteers.bc,
        data.volunteers.oc,
      ]],
      styles: { fontSize: 8, cellPadding: 2, halign: "center" },
      headStyles: { fillColor: [15, 25, 35], textColor: 255 },
    });

    const statsBody: (string | number)[][] = [];

    statsBody.push(["Activities", `Total No. of Activities: ${data.totalActivities}`, ""]);
    statsBody.push(["Special Camps", "No. of Special Camps conducted",        data.camps.total  ]);
    statsBody.push(["",             "No. of male volunteers participated",   data.camps.male   ]);
    statsBody.push(["",             "No. of female volunteers participated", data.camps.female ]);

    ACTIVITY_TYPES.forEach((type) => {
      statsBody.push([type.label, type.programLabel, getActivityCount(type.key)      ]);
      statsBody.push(["",         type.volLabel,      getActivityVolunteers(type.key) ]);
    });

    const lastY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;

    autoTable(doc, {
      startY: lastY,
      head: [["Category", "Description", "Count"]],
      body: statsBody,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [15, 25, 35], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 45 },
        1: { cellWidth: 110 },
        2: { halign: "right", cellWidth: 25 },
      },
      didParseCell: (hookData) => {
        if (hookData.column.index === 0 && hookData.cell.raw !== "") {
          hookData.cell.styles.fillColor = [230, 236, 245];
          hookData.cell.styles.textColor = [15, 25, 80];
        }
      },
    });

    const fileName = `NSS_Digest_${selectedCollege ? selectedCollegeName.replace(/\s+/g, "_") : "All"}${selectedYear ? `_${selectedYear}` : ""}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== HEADER ===== */}
      <div className="bg-blue-950 text-white py-10 text-center">
        <h1 className="text-3xl font-bold">JNTUK NSS Statistics</h1>
        <p className="text-blue-300 mt-2 text-sm">
          National Service Scheme — Jawaharlal Nehru Technological University Kakinada
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ===== FILTERS ===== */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-4">🔍 Filter</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Year Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Filter by Year
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

            {/* College Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Filter by College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Colleges</option>
                {data?.colleges.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.college_name} ({c.nss_unit_code})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {(selectedCollege || selectedYear) && (
            <p className="mt-3 text-sm text-blue-700 font-medium">
              Showing stats for:{" "}
              <span className="font-bold">{selectedCollegeName}</span>
              {selectedYear && (
                <span> — <span className="font-bold">{yearLabel}</span></span>
              )}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : data ? (
          <>

            {/* ===== VOLUNTEER SUMMARY BAR ===== */}
            <div className="bg-blue-950 text-white rounded-xl px-6 py-4 mb-8 text-sm flex flex-wrap gap-4 items-center justify-center">
              <span className="font-semibold">NSS Volunteers:</span>
              <span>Total: <strong>{data.volunteers.total}</strong></span>
              <span>Male: <strong>{data.volunteers.male}</strong></span>
              <span>Female: <strong>{data.volunteers.female}</strong></span>
              <span>SC: <strong>{data.volunteers.sc}</strong></span>
              <span>ST: <strong>{data.volunteers.st}</strong></span>
              <span>BC: <strong>{data.volunteers.bc}</strong></span>
              <span>OC: <strong>{data.volunteers.oc}</strong></span>
            </div>

            {/* ===== STATS TABLE ===== */}
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">

              <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">
                  JNTUK NSS Statistics
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={downloadExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ⬇️ Excel
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ⬇️ PDF
                  </button>
                </div>
              </div>

              <table className="w-full text-sm">
                <tbody>

                  {/* Total Activities */}
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-700">Total No. of Activities:</td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">{data.totalActivities}</td>
                  </tr>

                  {/* Special Camps */}
                  <tr className="border-b bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-semibold" colSpan={2}>Special Camps</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-600 pl-10">No. of Special Camps conducted:</td>
                    <td className="px-6 py-4 font-bold text-right">{data.camps.total}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-600 pl-10">No. of male volunteers participated:</td>
                    <td className="px-6 py-4 font-bold text-right">{data.camps.male}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 text-gray-600 pl-10">No. of female volunteers participated:</td>
                    <td className="px-6 py-4 font-bold text-right">{data.camps.female}</td>
                  </tr>

                  {/* Dynamic Activity Types */}
                  {ACTIVITY_TYPES.map((type) => (
                    <>
                      <tr key={`${type.key}-header`} className="border-b bg-gray-50">
                        <td className="px-6 py-4 text-gray-700 font-semibold" colSpan={2}>{type.label}</td>
                      </tr>
                      <tr key={`${type.key}-count`} className="border-b">
                        <td className="px-6 py-4 text-gray-600 pl-10">{type.programLabel}</td>
                        <td className="px-6 py-4 font-bold text-right">{getActivityCount(type.key)}</td>
                      </tr>
                      <tr key={`${type.key}-vol`} className="border-b">
                        <td className="px-6 py-4 text-gray-600 pl-10">{type.volLabel}</td>
                        <td className="px-6 py-4 font-bold text-right">{getActivityVolunteers(type.key)}</td>
                      </tr>
                    </>
                  ))}

                </tbody>
              </table>

              {/* Footer */}
              <div className="flex justify-center gap-8 py-6 border-t bg-gray-50">
                <div className="text-center">
                  <p className="text-blue-700 font-bold text-lg">{data.totalActivities}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Activities</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-700 font-bold text-lg">{data.volunteers.total}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Volunteers</p>
                </div>
              </div>

            </div>

          </>
        ) : (
          <p className="text-center text-red-500">Failed to load data.</p>
        )}

      </div>
    </div>
  );
}