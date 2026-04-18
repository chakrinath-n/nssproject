import { useEffect, useState } from "react";
import api from "@/api/axios";

interface Award {
  id: number;
  award_year: string;
  award_type: string;
  recipient_name: string;
  college_name: string;
  district: string;
  photo: string;
}

const AWARD_TYPES = [
  "National Best NSS Programme Officer Award",
  "National Best NSS Volunteer Award",
  "National Best NSS Unit Award",
  "State Best NSS Programme Officer Award",
  "State Best NSS Volunteer Award",
  "State Best NSS Unit Award",
  "Best NSS Programme Officer Award",
  "Best NSS Volunteer Award",
  "Best NSS Unit Award",
];

const DISTRICTS = [
  "East Godavari",
  "Kakinada",
  "Konaseema",
  "West Godavari",
  "Eluru",
  "NTR",
  "Krishna",
  "Guntur",
  "Palnadu",
  "Bapatla",
  "Prakasam",
  "Polavaram",
  "Markapuram",
  "SPSR Nellore",
];

export default function Awards() {

  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [form, setForm] = useState({
    award_year: "",
    award_type: "",
    recipient_name: "",
    college_name: "",
    district: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchAwards(); }, []);

  const fetchAwards = async () => {
    try {
      const res = await api.get("/awards");
      setAwards(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ award_year: "", award_type: "", recipient_name: "", college_name: "", district: "" });
    setPhoto(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEdit = (a: Award) => {
    setEditId(a.id);
    setForm({
      award_year: a.award_year,
      award_type: a.award_type,
      recipient_name: a.recipient_name,
      college_name: a.college_name,
      district: a.district || "",
    });
    setPhoto(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.award_year || !form.award_type || !form.recipient_name || !form.college_name) {
      return setError("All fields except district are required");
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (photo) data.append("photo", photo);

      if (editId) {
        await api.put(`/awards/${editId}`, data);
        setSuccess("Award updated successfully!");
      } else {
        await api.post("/awards", data);
        setSuccess("Award added successfully!");
      }

      setShowForm(false);
      fetchAwards();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Failed to save award");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this award?")) return;
    try {
      await api.delete(`/awards/${id}`);
      fetchAwards();
    } catch {
      alert("Failed to delete");
    }
  };

  // Group by year and type
  const grouped = awards.reduce((acc, award) => {
    const key = `${award.award_year}||${award.award_type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(award);
    return acc;
  }, {} as Record<string, Award[]>);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">NSS Awards Management</h1>
        <button
          onClick={openAdd}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Award
        </button>
      </div>

      {/* Grouped Awards */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No awards found. Click "Add Award" to add one.
        </p>
      ) : (
        Object.entries(grouped).map(([key, list]) => {
          const [year, type] = key.split("||");
          return (
            <div key={key} className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-3">
                {type} — {year}
              </h2>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Recipient Name</th>
                      <th className="px-4 py-3 text-left">College</th>
                      <th className="px-4 py-3 text-left">District</th>
                      <th className="px-4 py-3 text-left">Photo</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((a, index) => (
                      <tr key={a.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{a.recipient_name}</td>
                        <td className="px-4 py-3">{a.college_name}</td>
                        <td className="px-4 py-3">{a.district || "—"}</td>
                        <td className="px-4 py-3">
                          {a.photo ? (
                            <img
                              src={`http://localhost:5000/uploads/${a.photo}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(a)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}

      {/* ===== ADD / EDIT MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editId ? "Edit Award" : "Add Award"}
              </h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setShowForm(false)}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Award Year + Award Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Award Year</label>
                  <input
                    placeholder="e.g. 2023-24"
                    value={form.award_year}
                    onChange={(e) => setForm(prev => ({ ...prev, award_year: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Award Type</label>
                  <select
                    value={form.award_type}
                    onChange={(e) => setForm(prev => ({ ...prev, award_type: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                  >
                    <option value="">Select Type</option>
                    {AWARD_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">Recipient Name</label>
                <input
                  
                  value={form.recipient_name}
                  onChange={(e) => setForm(prev => ({ ...prev, recipient_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              {/* College Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">College Name</label>
                <input
                  
                  value={form.college_name}
                  onChange={(e) => setForm(prev => ({ ...prev, college_name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              {/* ✅ District Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-600">District</label>
                <select
                  value={form.district}
                  onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Photo */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Photo {editId && "(leave empty to keep existing)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded text-sm">
                  ❌ {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-300 text-green-600 px-4 py-2 rounded text-sm">
                  ✅ {success}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg text-sm"
                >
                  {editId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm"
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