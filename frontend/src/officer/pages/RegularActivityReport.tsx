import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";

interface Activity {
  id: number;
  activity_name: string;
  description: string;
  activity_type_name: string;
  event_date: string;
  end_date: string;
  volunteers_count: number;
  location: string;
  photo1: string;
  photo2: string;
  photo3: string;
  paper_clipping1: string; // ✅ NEW
  paper_clipping2: string; // ✅ NEW
}

const ACTIVITY_TYPES = [
  { id: 1, name: "Blood Donation" },
  { id: 2, name: "Plantation of Saplings" },
  { id: 3, name: "Pulse Polio Campaign" },
  { id: 4, name: "Water Harvesting Pits" },
  { id: 5, name: "Swachh Bharat" },
  { id: 6, name: "Pre-Republic Day" },
  { id: 7, name: "Other Activity" },
];

export default function RegularActivityReport() {
  const { typeId } = useParams();
  const activityType = ACTIVITY_TYPES.find((t) => t.id === Number(typeId));

  const [activities, setActivities]     = useState<Activity[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState<number | null>(null);
  const [previewPhotos, setPreviewPhotos] = useState<{
    images: string[];
    title: string;
  } | null>(null);

  const [form, setForm] = useState({
    activity_name: "",
    description: "",
    event_date: "",
    end_date: "",
    volunteers_count: "",
    location: "",
  });

  const [photos, setPhotos] = useState<{
    photo1: File | null;
    photo2: File | null;
    photo3: File | null;
  }>({ photo1: null, photo2: null, photo3: null });

  // ✅ NEW — clipping state
  const [clippings, setClippings] = useState<{
    paper_clipping1: File | null;
    paper_clipping2: File | null;
  }>({ paper_clipping1: null, paper_clipping2: null });

  const [clipping1Preview, setClipping1Preview] = useState<string | null>(null);
  const [clipping2Preview, setClipping2Preview] = useState<string | null>(null);

  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchActivities(); }, [typeId]);

  /* ================= FETCH ================= */

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/officer/activities/type/${typeId}`);
      setActivities(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoto = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "photo1" | "photo2" | "photo3"
  ) => {
    if (e.target.files?.[0])
      setPhotos((prev) => ({ ...prev, [key]: e.target.files![0] }));
  };

  // ✅ NEW
  const handleClipping = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "paper_clipping1" | "paper_clipping2"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setClippings((prev) => ({ ...prev, [key]: file }));
      const preview = URL.createObjectURL(file);
      if (key === "paper_clipping1") setClipping1Preview(preview);
      else setClipping2Preview(preview);
    }
  };

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setForm({
      activity_name: "", description: "", event_date: "",
      end_date: "", volunteers_count: "", location: "",
    });
    setPhotos({ photo1: null, photo2: null, photo3: null });
    setClippings({ paper_clipping1: null, paper_clipping2: null });
    setClipping1Preview(null);
    setClipping2Preview(null);
    setError("");
    setSuccess("");
  };

  /* ================= OPEN ADD ================= */

  const openAdd = () => {
    setEditId(null);
    resetForm();
    setShowForm(true);
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (a: Activity) => {
    setEditId(a.id);
    setForm({
      activity_name:    a.activity_name,
      description:      a.description,
      event_date:       a.event_date?.slice(0, 10),
      end_date:         a.end_date?.slice(0, 10) || "",
      volunteers_count: String(a.volunteers_count),
      location:         a.location,
    });
    setPhotos({ photo1: null, photo2: null, photo3: null });
    setClippings({ paper_clipping1: null, paper_clipping2: null });
    // Show existing clippings as previews
    setClipping1Preview(
      a.paper_clipping1 ? `http://localhost:5000/uploads/${a.paper_clipping1}` : null
    );
    setClipping2Preview(
      a.paper_clipping2 ? `http://localhost:5000/uploads/${a.paper_clipping2}` : null
    );
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.activity_name || !form.description || !form.event_date)
      return setError("Activity name, description and start date are required");

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      data.append("activity_type_id", typeId!);

      if (photos.photo1) data.append("photo1", photos.photo1);
      if (photos.photo2) data.append("photo2", photos.photo2);
      if (photos.photo3) data.append("photo3", photos.photo3);

      // ✅ NEW
      if (clippings.paper_clipping1) data.append("paper_clipping1", clippings.paper_clipping1);
      if (clippings.paper_clipping2) data.append("paper_clipping2", clippings.paper_clipping2);

      if (editId) {
        await api.put(`/officer/activities/${editId}`, data);
        setSuccess("Activity updated successfully!");
      } else {
        await api.post("/officer/activities/add", data);
        setSuccess("Activity added successfully!");
      }

      setShowForm(false);
      fetchActivities();

    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to save activity");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await api.delete(`/officer/activities/${id}`);
      fetchActivities();
    } catch {
      alert("Failed to delete activity");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {activityType?.name || "Activity Report"}
        </h1>
        <button
          onClick={openAdd}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Activity
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && activities.length === 0 && (
        <p className="text-gray-400 text-center py-10">
          No activities found. Click "Add Activity" to add one.
        </p>
      )}

      {/* Table */}
      {!loading && activities.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Activity Name</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Start Date</th>
                <th className="border px-3 py-2">End Date</th>
                <th className="border px-3 py-2">Volunteers</th>
                <th className="border px-3 py-2">Location</th>
                <th className="border px-3 py-2">Photos</th>
                <th className="border px-3 py-2">Paper Clippings</th> {/* ✅ NEW */}
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a, index) => (
                <tr key={a.id} className="hover:bg-gray-50">

                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{a.activity_name}</td>
                  <td className="border px-3 py-2 max-w-xs truncate">{a.description}</td>
                  <td className="border px-3 py-2">{a.event_date?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{a.end_date?.slice(0, 10) || "—"}</td>
                  <td className="border px-3 py-2 text-center">{a.volunteers_count}</td>
                  <td className="border px-3 py-2">{a.location}</td>

                  {/* Event Photos */}
                  <td className="border px-3 py-2">
                    <div className="flex gap-1">
                      {[a.photo1, a.photo2, a.photo3].map((photo, i) =>
                        photo ? (
                          <img
                            key={i}
                            src={`http://localhost:5000/uploads/${photo}`}
                            className="w-8 h-8 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setPreviewPhotos({
                                title: "Event Photos",
                                images: [a.photo1, a.photo2, a.photo3].filter(Boolean),
                              })
                            }
                          />
                        ) : null
                      )}
                      {!a.photo1 && !a.photo2 && !a.photo3 && (
                        <span className="text-gray-400 text-xs">No photos</span>
                      )}
                    </div>
                  </td>

                  {/* ✅ Paper Clippings */}
                  <td className="border px-3 py-2">
                    <div className="flex gap-1">
                      {[a.paper_clipping1, a.paper_clipping2].map((clip, i) =>
                        clip ? (
                          <div
                            key={i}
                            className="relative cursor-pointer"
                            onClick={() =>
                              setPreviewPhotos({
                                title: "Newspaper Clippings",
                                images: [a.paper_clipping1, a.paper_clipping2].filter(Boolean),
                              })
                            }
                          >
                            <img
                              src={`http://localhost:5000/uploads/${clip}`}
                              className="w-8 h-8 object-cover rounded hover:opacity-80 border border-yellow-400"
                            />
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                              {i + 1}
                            </span>
                          </div>
                        ) : null
                      )}
                      {!a.paper_clipping1 && !a.paper_clipping2 && (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="border px-3 py-2">
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
      )}

      {/* ===== PHOTO / CLIPPING PREVIEW MODAL ===== */}
      {previewPhotos && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{previewPhotos.title}</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setPreviewPhotos(null)}
              >✕</button>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              {previewPhotos.images.map((photo, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/uploads/${photo}`}
                  className="max-h-72 rounded-lg object-cover shadow"
                />
              ))}
            </div>
            <button
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg"
              onClick={() => setPreviewPhotos(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== ADD / EDIT MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editId ? "Edit Activity" : "Add Activity"}
              </h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setShowForm(false)}
              >✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Activity Name */}
              <div>
                <label className="text-sm font-medium text-gray-600">Activity Name</label>
                <input
                  name="activity_name"
                  value={form.activity_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter activity name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <input
                    type="date"
                    name="event_date"
                    value={form.event_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              {/* Volunteers Count */}
              <div>
                <label className="text-sm font-medium text-gray-600">Number of Volunteers</label>
                <input
                  type="number"
                  name="volunteers_count"
                  value={form.volunteers_count}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter volunteer count"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Enter location"
                />
              </div>

              {/* Photo 1 */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Photo 1 {editId && "(leave empty to keep existing)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e, "photo1")}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              {/* Photo 2 */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Photo 2 {editId && "(leave empty to keep existing)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e, "photo2")}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              {/* Photo 3 */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Photo 3 {editId && "(leave empty to keep existing)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e, "photo3")}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              {/* ✅ Paper Clipping 1 */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  News Paper Clipping-1{" "}
                  <span className="text-xs text-gray-400">(JPG/JPEG, Max 400KB)</span>
                  {editId && <span className="text-xs text-gray-400"> — leave empty to keep existing</span>}
                </label>
                <div className="flex items-center gap-3 mt-1">
                  {clipping1Preview && (
                    <img
                      src={clipping1Preview}
                      className="w-14 h-14 object-cover rounded border border-yellow-400"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/*"
                    onChange={(e) => handleClipping(e, "paper_clipping1")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* ✅ Paper Clipping 2 */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  News Paper Clipping-2{" "}
                  <span className="text-xs text-gray-400">(JPG/JPEG, Max 400KB)</span>
                  {editId && <span className="text-xs text-gray-400"> — leave empty to keep existing</span>}
                </label>
                <div className="flex items-center gap-3 mt-1">
                  {clipping2Preview && (
                    <img
                      src={clipping2Preview}
                      className="w-14 h-14 object-cover rounded border border-yellow-400"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/*"
                    onChange={(e) => handleClipping(e, "paper_clipping2")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
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
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg"
                >
                  {editId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
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