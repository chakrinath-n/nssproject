import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Download } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getNssUnits,
  deleteNssUnit,
  createNssUnit,
  updateNssUnit,
  type NssUnit,
} from "../services/nssUnit.api";

/* ================= FIELD HELPERS (outside component) ================= */

type FormData = {
  district: string;
  nss_unit_code: string;
  college_code: string;
  college_name: string;
  unit_type: string;
  programme_officer: string;
  officer_email: string;
  adopted_village: string;
  state: string;
  block: string;
  university_name: string;
  governing_body: string;
  courses_offered: string;
  college_type: string;
  college_address: string;
  college_phone: string;
  college_email: string;
  po_gender: string;
  po_mob_no: string;
  po_aadhaar: string;
  po_blood_group: string;
  po_teaching_subject: string;
  po_experience: string;
  po_eti_status: string;
};

function Field({
  placeholder,
  field,
  type = "text",
  formData,
  setFormData,
}: {
  placeholder: string;
  field: keyof FormData;
  type?: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={formData[field]}
      onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
      className="w-full border p-2 rounded-lg text-sm"
    />
  );
}

function SelectField({
  placeholder,
  field,
  options,
  formData,
  setFormData,
  disabled = false,
}: {
  placeholder: string;
  field: keyof FormData;
  options: string[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  disabled?: boolean;
}) {
  return (
    <select
      value={formData[field]}
      onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
      disabled={disabled}
      className="w-full border p-2 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/* ================= STATIC OPTIONS ================= */

const districts = [
  "East Godavari", "Kakinada", "Konaseema", "West Godavari",
  "Eluru", "NTR", "Krishna", "Guntur", "Palnadu", "Bapatla",
  "Prakasam", "Polavaram", "Markapuram", "SPSR Nellore",
];

const unitTypes     = ["Government Funded", "Self Funded"];
const bloodGroups   = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const etiOptions    = ["Trained", "Untrained"];
const genderOptions = ["Male", "Female", "Other"];
const collegeTypes  = ["Govt.", "Pvt.", "Deemed", "Autonomous"];

const defaultFormData: FormData = {
  state: "Andhra Pradesh", district: "", block: "", university_name: "",
  college_code: "", college_name: "", governing_body: "", courses_offered: "",
  college_type: "", unit_type: "", nss_unit_code: "", adopted_village: "",
  college_address: "", college_phone: "", college_email: "",
  programme_officer: "", officer_email: "", po_gender: "", po_mob_no: "",
  po_aadhaar: "", po_blood_group: "", po_teaching_subject: "",
  po_experience: "", po_eti_status: "",
};

/* ================= EXCEL HEADERS ================= */

const HEADERS = [
  "Sl. No", "State", "District", "Block", "University Name", "College Name",
  "Governing Body", "Courses Offered", "College Type", "College Address",
  "Phone (STD)", "College Email", "Unit Code", "Unit Type",
  "Programme Officer", "Gender", "PO Mob No", "PO Email",
  "PO Aadhaar", "Blood Group", "Teaching Subject", "Experience as PO",
  "ETI Status", "Adopted Village",
];

/* ================= MAIN COMPONENT ================= */

export default function NssUnits() {
  const [units, setUnits]           = useState<NssUnit[]>([]);
  const [loading, setLoading]       = useState(true);
  const [openModal, setOpenModal]   = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData]     = useState<FormData>(defaultFormData);

  /* ================= FETCH ================= */

  const fetchUnits = async () => {
    try {
      const res = await getNssUnits();
      setUnits(res.data);
    } catch {
      toast.error("Failed to fetch NSS Units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnits(); }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this NSS Unit?")) return;
    try {
      await deleteNssUnit(id);
      toast.success("Unit deleted successfully");
      fetchUnits();
    } catch {
      toast.error("Failed to delete unit");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!formData.district || !formData.nss_unit_code || !formData.college_name || !formData.officer_email) {
      toast.error("District, Unit Code, College Name and Officer Email are required");
      return;
    }
    try {
      setSubmitting(true);
      if (editId) {
        await updateNssUnit(editId, formData);
        toast.success("Unit updated successfully");
      } else {
        await createNssUnit(formData);
        toast.success("Unit added successfully");
      }
      setOpenModal(false);
      setEditId(null);
      setFormData(defaultFormData);
      fetchUnits();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= ROW MAPPER ================= */

  const toRow = (unit: NssUnit, index: number) => [
    index + 1,
    unit.state               || "—",
    unit.district            || "—",
    unit.block               || "—",
    unit.university_name     || "—",
    unit.college_name,
    unit.governing_body      || "—",
    unit.courses_offered     || "—",
    unit.college_type        || "—",
    unit.college_address     || "—",
    unit.college_phone       || "—",
    unit.college_email       || "—",
    unit.nss_unit_code,
    unit.unit_type           || "—",
    unit.programme_officer   || "—",
    unit.po_gender           || "—",
    unit.po_mob_no           || "—",
    unit.officer_email       || "—",
    unit.po_aadhaar          || "—",
    unit.po_blood_group      || "—",
    unit.po_teaching_subject || "—",
    unit.po_experience       || "—",
    unit.po_eti_status       || "—",
    unit.adopted_village     || "—",
  ];

  /* ================= DOWNLOAD EXCEL ================= */

  const downloadExcel = () => {
    if (!units.length) return toast.error("No data to download");

    const wb = XLSX.utils.book_new();

    // ── Sheet 1: All Districts combined ──
    const allRows = units.map((u, i) => toRow(u, i));
    const allSheet = XLSX.utils.aoa_to_sheet([
      ["JNTUK NSS Units — All Districts"],
      [`Total Units: ${units.length}`],
      [],
      HEADERS,
      ...allRows,
    ]);
    allSheet["!cols"] = HEADERS.map((_, i) =>
      ({ wch: i === 5 || i === 4 ? 35 : i === 9 ? 30 : 16 })
    );
    XLSX.utils.book_append_sheet(wb, allSheet, "All Districts");

    // ── Sheet per District ──
    districts.forEach((district) => {
      const filtered = units.filter((u) => u.district === district);
      if (!filtered.length) return;

      const rows = filtered.map((u, i) => toRow(u, i));
      const ws = XLSX.utils.aoa_to_sheet([
        [`JNTUK NSS Units — ${district}`],
        [`Total Units: ${filtered.length}`],
        [],
        HEADERS,
        ...rows,
      ]);
      ws["!cols"] = HEADERS.map((_, i) =>
        ({ wch: i === 5 || i === 4 ? 35 : i === 9 ? 30 : 16 })
      );
      // Sheet name max 31 chars
      XLSX.utils.book_append_sheet(wb, ws, district.slice(0, 31));
    });

    XLSX.writeFile(wb, `NSS_Units_All_Districts.xlsx`);
  };

  /* ================= DOWNLOAD PDF ================= */

  const downloadPDF = () => {
    if (!units.length) return toast.error("No data to download");

    const doc = new jsPDF({ orientation: "landscape", format: "a3" });
    const pageWidth = doc.internal.pageSize.width;
    let isFirstPage = true;

    districts.forEach((district) => {
      const filtered = units.filter((u) => u.district === district);
      if (!filtered.length) return;

      if (!isFirstPage) doc.addPage();
      isFirstPage = false;

      // District heading
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("JNTUK NSS Units", pageWidth / 2, 14, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`District: ${district}  |  Total Units: ${filtered.length}`, pageWidth / 2, 21, { align: "center" });

      autoTable(doc, {
        startY: 26,
        head: [HEADERS],
        body: filtered.map((u, i) => toRow(u, i)),
        styles: { fontSize: 6, cellPadding: 1.5 },
        headStyles: { fillColor: [15, 25, 35], textColor: 255, fontSize: 6 },
        alternateRowStyles: { fillColor: [248, 248, 248] },
        columnStyles: {
          0:  { cellWidth: 8  },   // Sl No
          1:  { cellWidth: 18 },   // State
          2:  { cellWidth: 18 },   // District
          3:  { cellWidth: 14 },   // Block
          4:  { cellWidth: 28 },   // University
          5:  { cellWidth: 28 },   // College Name
          6:  { cellWidth: 16 },   // Governing Body
          7:  { cellWidth: 18 },   // Courses
          8:  { cellWidth: 12 },   // College Type
          9:  { cellWidth: 24 },   // Address
          10: { cellWidth: 14 },   // Phone
          11: { cellWidth: 22 },   // College Email
          12: { cellWidth: 12 },   // Unit Code
          13: { cellWidth: 16 },   // Unit Type
          14: { cellWidth: 20 },   // PO Name
          15: { cellWidth: 10 },   // Gender
          16: { cellWidth: 14 },   // PO Mob
          17: { cellWidth: 22 },   // PO Email
          18: { cellWidth: 16 },   // Aadhaar
          19: { cellWidth: 10 },   // Blood Group
          20: { cellWidth: 18 },   // Teaching Subject
          21: { cellWidth: 14 },   // Experience
          22: { cellWidth: 12 },   // ETI
          23: { cellWidth: 16 },   // Village
        },
      });
    });

    doc.save("NSS_Units_All_Districts.pdf");
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  /* ================= RENDER ================= */

  const fieldProps = { formData, setFormData };

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-navy">NSS Units Management</h1>

        <div className="flex items-center gap-3">
          {/* Download Buttons */}
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>

          {/* Add Unit */}
          <button
            onClick={() => { setEditId(null); setFormData(defaultFormData); setOpenModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white hover:bg-navy-light"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </button>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      <div className="bg-blue-950 text-white rounded-xl px-6 py-3 text-sm flex flex-wrap gap-6 items-center">
        <span className="font-semibold">Total NSS Units: <strong>{units.length}</strong></span>
        {districts.map((d) => {
          const count = units.filter((u) => u.district === d).length;
          return count > 0 ? (
            <span key={d}>{d}: <strong>{count}</strong></span>
          ) : null;
        })}
      </div>

      {/* ================= DISTRICT TABLES ================= */}

      {districts.map((district) => {
        const filteredUnits = units.filter((unit) => unit.district === district);

        return (
          <div key={district} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy">
                {district}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({filteredUnits.length} unit{filteredUnits.length !== 1 ? "s" : ""})
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    {HEADERS.map((h) => (
                      <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>
                    ))}
                    <th className="p-3 text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((unit, index) => (
                      <tr key={unit.id} className="border-t hover:bg-slate-50">
                        {toRow(unit, index).map((val, i) => (
                          <td key={i} className="p-3 whitespace-nowrap">{val}</td>
                        ))}
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => {
                                setEditId(unit.id);
                                setFormData({
                                  state:               unit.state               || "Andhra Pradesh",
                                  district:            unit.district            || "",
                                  block:               unit.block               || "",
                                  university_name:     unit.university_name     || "",
                                  college_code:        unit.college_code        || "",
                                  college_name:        unit.college_name        || "",
                                  governing_body:      unit.governing_body      || "",
                                  courses_offered:     unit.courses_offered     || "",
                                  college_type:        unit.college_type        || "",
                                  unit_type:           unit.unit_type           || "",
                                  nss_unit_code:       unit.nss_unit_code       || "",
                                  adopted_village:     unit.adopted_village     || "",
                                  college_address:     unit.college_address     || "",
                                  college_phone:       unit.college_phone       || "",
                                  college_email:       unit.college_email       || "",
                                  programme_officer:   unit.programme_officer   || "",
                                  officer_email:       unit.officer_email       || "",
                                  po_gender:           unit.po_gender           || "",
                                  po_mob_no:           unit.po_mob_no           || "",
                                  po_aadhaar:          unit.po_aadhaar          || "",
                                  po_blood_group:      unit.po_blood_group      || "",
                                  po_teaching_subject: unit.po_teaching_subject || "",
                                  po_experience:       unit.po_experience       || "",
                                  po_eti_status:       unit.po_eti_status       || "",
                                });
                                setOpenModal(true);
                              }}
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button onClick={() => handleDelete(unit.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={HEADERS.length + 1} className="p-6 text-center text-slate-400">
                        No Units in {district}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* ================= MODAL ================= */}

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 pb-10 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editId ? "Update NSS Unit" : "Add NSS Unit"}
              </h3>
              <button onClick={() => setOpenModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">

              {/* ── College Information ── */}
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                College Information
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value="Andhra Pradesh"
                  disabled
                  className="w-full border p-2 rounded-lg text-sm bg-gray-100 text-gray-500"
                />
                <SelectField placeholder="Select District"  field="district"        options={districts}    {...fieldProps} />
                <Field       placeholder="Block"            field="block"                                  {...fieldProps} />
                <Field       placeholder="University Name"  field="university_name"                        {...fieldProps} />
                <Field       placeholder="College Code"     field="college_code"                           {...fieldProps} />
                <Field       placeholder="College Name"     field="college_name"                           {...fieldProps} />
                <Field       placeholder="Governing Body"   field="governing_body"                         {...fieldProps} />
                <Field       placeholder="Courses Offered"  field="courses_offered"                        {...fieldProps} />
                <SelectField placeholder="College Type"     field="college_type"    options={collegeTypes} {...fieldProps} />
                <SelectField placeholder="Select Unit Type" field="unit_type"       options={unitTypes}    {...fieldProps} />
                <Field       placeholder="NSS Unit Code"    field="nss_unit_code"                          {...fieldProps} />
                <Field       placeholder="Adopted Village"  field="adopted_village"                        {...fieldProps} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Field placeholder="College Address / Institution"   field="college_address" {...fieldProps} />
                <Field placeholder="College Telephone with STD Code" field="college_phone"   {...fieldProps} />
                <Field placeholder="College / Institution Email ID"  field="college_email"   {...fieldProps} />
              </div>

              {/* ── Programme Officer ── */}
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-2">
                Programme Officer Details
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Field       placeholder="Programme Officer Name"    field="programme_officer"   {...fieldProps} />
                <SelectField placeholder="Gender"                    field="po_gender"            options={genderOptions} {...fieldProps} />
                <Field       placeholder="PO Mobile Number" type="tel"   field="po_mob_no"        {...fieldProps} />
                <Field       placeholder="PO Email"         type="email" field="officer_email"    {...fieldProps} />
                <Field       placeholder="PO Aadhaar Number"        field="po_aadhaar"            {...fieldProps} />
                <SelectField placeholder="PO Blood Group"           field="po_blood_group"        options={bloodGroups}  {...fieldProps} />
                <Field       placeholder="PO Teaching Subject"      field="po_teaching_subject"   {...fieldProps} />
                <Field       placeholder="Experience as PO (years)" field="po_experience"         {...fieldProps} />
                <SelectField placeholder="ETI Trained / Untrained"  field="po_eti_status"         options={etiOptions}   {...fieldProps} />
              </div>

            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-navy text-white py-2 rounded-lg mt-6 font-medium"
            >
              {submitting
                ? editId ? "Updating..." : "Saving..."
                : editId ? "Update Unit" : "Save Unit"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}