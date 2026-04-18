import { useEffect, useState } from "react";
import api from "@/api/axios";

interface Volunteer {
  id: number;
  hallticket_no: string;
  student_name: string;
  dob: string;
  course: string;
  year: number;
  semester: number;
  gender: string;
  category: string;
  contact_number: string;
  blood_group: string;
  email: string;
  photo: string;
  aadhaar_number: string;
  nss_group_number: string;
  father_name: string;
  father_occupation: string;
  address: string;
  permanent_address: string;
  willing_donate_blood: boolean;
  entry_date: string;
}

/* ── typed edit form (no `any`) ── */
interface EditForm {
  hallticket_no: string;
  student_name: string;
  dob: string;
  course: string;
  year: string;
  semester: string;
  gender: string;
  category: string;
  contact_number: string;
  blood_group: string;
  email: string;
  aadhaar_number: string;
  nss_group_number: string;
  father_name: string;
  father_occupation: string;
  address: string;
  permanent_address: string;
  willing_donate_blood: string;
  entry_date: string;
}

const EMPTY_FORM: EditForm = {
  hallticket_no: "", student_name: "", dob: "", course: "",
  year: "", semester: "", gender: "", category: "",
  contact_number: "", blood_group: "", email: "",
  aadhaar_number: "", nss_group_number: "", father_name: "",
  father_occupation: "", address: "", permanent_address: "",
  willing_donate_blood: "", entry_date: "",
};

export default function ViewVolunteers() {

  const [volunteers, setVolunteers]         = useState<Volunteer[]>([]);
  const [search, setSearch]                 = useState("");
  const [preview, setPreview]               = useState<string | null>(null);
  const [loading, setLoading]               = useState(true);

  const [editModal, setEditModal]           = useState(false);
  const [editForm, setEditForm]             = useState<EditForm>(EMPTY_FORM);
  const [editPhoto, setEditPhoto]           = useState<File | null>(null);
  const [editId, setEditId]                 = useState<number | null>(null);
  const [sameAddress, setSameAddress]       = useState(false);

  const [detailModal, setDetailModal]       = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => { fetchVolunteers(); }, []);

  /* ================= FETCH ================= */

  const fetchVolunteers = async () => {
    try {
      const res = await api.get("/officer/volunteers");
      setVolunteers(res.data);
    } catch (error) {
      console.error("Failed to fetch volunteers", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteVolunteer = async (id: number) => {
    if (!confirm("Delete this volunteer?")) return;
    try {
      await api.delete(`/officer/volunteers/${id}`);
      fetchVolunteers();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete volunteer");
    }
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (v: Volunteer) => {
    setEditId(v.id);
    setEditForm({
      hallticket_no:        v.hallticket_no        || "",
      student_name:         v.student_name         || "",
      dob:                  v.dob?.slice(0, 10)    || "",
      course:               v.course               || "",
      year:                 String(v.year)         || "",
      semester:             String(v.semester)     || "",
      gender:               v.gender               || "",
      category:             v.category             || "",
      contact_number:       v.contact_number       || "",
      blood_group:          v.blood_group          || "",
      email:                v.email                || "",
      aadhaar_number:       v.aadhaar_number       || "",
      nss_group_number:     v.nss_group_number     || "",
      father_name:          v.father_name          || "",
      father_occupation:    v.father_occupation    || "",
      address:              v.address              || "",
      permanent_address:    v.permanent_address    || "",
      willing_donate_blood: String(v.willing_donate_blood),
      entry_date:           v.entry_date?.slice(0, 10) || "",
    });
    setSameAddress(false);
    setEditPhoto(null);
    setEditModal(true);
  };

  /* ================= HANDLE EDIT CHANGE ================= */

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updated = { ...prev, [name]: value };
      // keep permanent address in sync if checkbox is on
      if (sameAddress && name === "address") {
        updated.permanent_address = value;
      }
      return updated;
    });
  };

  const handleSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      setEditForm((prev) => ({ ...prev, permanent_address: prev.address }));
    }
  };

  /* ================= SUBMIT EDIT ================= */

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const data = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, value);
      });
      if (editPhoto) data.append("photo", editPhoto);
      await api.put(`/officer/volunteers/${editId}`, data);
      alert("Volunteer updated successfully");
      setEditModal(false);
      fetchVolunteers();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update volunteer");
    }
  };

  /* ================= SEARCH ================= */

  const filtered = volunteers.filter((v) =>
    v.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.hallticket_no?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading volunteers...</div>;

  /* ── reusable field components ── */
  const Field = ({
    label, name, type = "text", placeholder,
  }: {
    label: string; name: keyof EditForm; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={editForm[name]}
        onChange={handleEditChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </div>
  );

  const Select = ({
    label, name, options,
  }: {
    label: string; name: keyof EditForm; options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      <select
        name={name}
        value={editForm[name]}
        onChange={handleEditChange}
        className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="bg-white p-6 rounded shadow">

      <h1 className="text-xl font-bold mb-4">Volunteer Information</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search volunteer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-72"
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Photo</th>
              <th className="border px-2 py-1">HTNO</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Year</th>
              <th className="border px-2 py-1">Gender</th>
              <th className="border px-2 py-1">Contact</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No volunteers found
                </td>
              </tr>
            )}
            {filtered.map((v) => (
              <tr key={v.id} className="border-t hover:bg-gray-50">

                <td className="border px-2 py-1">
                  {v.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${v.photo}`}
                      className="w-10 h-10 rounded cursor-pointer object-cover"
                      onClick={() => setPreview(v.photo)}
                    />
                  ) : "No Photo"}
                </td>

                <td className="border px-2 py-1">{v.hallticket_no}</td>
                <td className="border px-2 py-1">{v.student_name}</td>
                <td className="border px-2 py-1">{v.course}</td>
                <td className="border px-2 py-1">{v.year}</td>
                <td className="border px-2 py-1">{v.gender}</td>
                <td className="border px-2 py-1">{v.contact_number}</td>
                <td className="border px-2 py-1">{v.email}</td>

                <td className="border px-2 py-1">
                  <div className="flex gap-1 flex-wrap">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => { setSelectedVolunteer(v); setDetailModal(true); }}
                    >View</button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => openEdit(v)}
                    >Edit</button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => deleteVolunteer(v.id)}
                    >Delete</button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PHOTO PREVIEW POPUP ===== */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded">
            <img
  src={`http://localhost:5000/uploads/${preview}`}
  className="max-h-125"
/>
            <button
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setPreview(null)}
            >Close</button>
          </div>
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      {detailModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Volunteer Details</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setDetailModal(false)}
              >✕</button>
            </div>

            {selectedVolunteer.photo && (
              <div className="flex justify-center mb-4">
                <img
                  src={`http://localhost:5000/uploads/${selectedVolunteer.photo}`}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {(
                [
                  ["Hall Ticket No",          selectedVolunteer.hallticket_no],
                  ["Student Name",            selectedVolunteer.student_name],
                  ["Date of Birth",           selectedVolunteer.dob?.slice(0, 10)],
                  ["Course",                  selectedVolunteer.course],
                  ["Year",                    String(selectedVolunteer.year)],
                  ["Semester",                String(selectedVolunteer.semester)],
                  ["Gender",                  selectedVolunteer.gender],
                  ["Category",                selectedVolunteer.category],
                  ["Contact",                 selectedVolunteer.contact_number],
                  ["Blood Group",             selectedVolunteer.blood_group],
                  ["Email",                   selectedVolunteer.email],
                  ["Aadhaar No",              selectedVolunteer.aadhaar_number],
                  ["NSS Group No",            selectedVolunteer.nss_group_number],
                  ["Father Name",             selectedVolunteer.father_name],
                  ["Father Occupation",       selectedVolunteer.father_occupation],
                  ["Willing to Donate Blood", selectedVolunteer.willing_donate_blood ? "Yes" : "No"],
                  ["Entry Date",              selectedVolunteer.entry_date?.slice(0, 10)],
                  ["Address",                 selectedVolunteer.address],
                  ["Permanent Address",       selectedVolunteer.permanent_address],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="font-medium">{value || "—"}</p>
                </div>
              ))}
            </div>

            <button
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg"
              onClick={() => setDetailModal(false)}
            >Close</button>

          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Volunteer Form</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setEditModal(false)}
              >✕</button>
            </div>

            <form onSubmit={submitEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Row 1 */}
                <Field label="Hallticket No"  name="hallticket_no" />
                <Field label="Student Name"   name="student_name" />

                {/* Row 2 */}
                <Field label="Date Of Birth"  name="dob"    type="date" />
                <Field label="Course"         name="course" />

                {/* Row 3 */}
                <Field label="Year"     name="year"     type="number" />
                <Field label="Semester" name="semester" type="number" />

                {/* Row 4 */}
                <Select
                  label="Gender" name="gender"
                  options={[
                    { value: "Male",   label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other",  label: "Other" },
                  ]}
                />
                <Select
                  label="Reservation Category" name="category"
                  options={[
                    { value: "SC", label: "SC" },
                    { value: "ST", label: "ST" },
                    { value: "BC", label: "BC" },
                    { value: "OC", label: "OC" },
                  ]}
                />

                {/* Row 5 */}
                <Field label="Contact Number" name="contact_number" />
                <Select
                  label="Blood Group" name="blood_group"
                  options={["A+","B+","O+","AB+","A-","B-","O-","AB-"].map((bg) => ({
                    value: bg, label: bg,
                  }))}
                />

                {/* Row 6 */}
                <Field label="Email Id"       name="email" type="email" />

                {/* Photo */}
                <div>
                  <label className="text-sm text-gray-600 font-medium">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setEditPhoto(e.target.files[0])}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  />
                </div>

                {/* Row 7 */}
                <Field label="Aadhaar Number"  name="aadhaar_number" />
                <Field label="NSS Group Number" name="nss_group_number" />

                {/* Row 8 */}
                <Field label="Father Name"       name="father_name" />
                <Field label="Father Occupation" name="father_occupation" />

                {/* Address — full width */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 font-medium">Address</label>
                  <textarea
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>

                {/* Same address checkbox */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    id="sameAddr"
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => handleSameAddress(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="sameAddr" className="text-sm text-gray-600 cursor-pointer">
                    Permanent Address same as Address
                  </label>
                </div>

                {/* Permanent Address — full width */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 font-medium">Permanent Address</label>
                  <textarea
                    name="permanent_address"
                    value={editForm.permanent_address}
                    onChange={handleEditChange}
                    rows={3}
                    disabled={sameAddress}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-100"
                  />
                </div>

                {/* Row last */}
                <Select
                  label="Willing Donate Blood" name="willing_donate_blood"
                  options={[
                    { value: "true",  label: "Yes" },
                    { value: "false", label: "No" },
                  ]}
                />
                <Field label="Entry Date" name="entry_date" type="date" />

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}