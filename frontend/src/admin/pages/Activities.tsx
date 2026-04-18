import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  getActivities,
  deleteActivity,
  createActivity,
  updateActivity, // ✅ import update
  type Activity,
} from "../services/activity.api";

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null); // ✅ edit state

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Regular Activities",
  });

  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH ================= */

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(res.data);
    } catch (error) {
      toast.error("Failed to fetch activities");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await deleteActivity(id);
      toast.success("Activity deleted successfully");
      fetchActivities();
    } catch (error) {
      toast.error("Failed to delete activity");
      console.error(error);
    }
  };

  /* ================= SUBMIT (ADD + UPDATE) ================= */

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    try {
      setSubmitting(true);

      if (editId) {
        await updateActivity(editId, formData);
        toast.success("Activity updated successfully");
      } else {
        await createActivity(formData);
        toast.success("Activity added successfully");
      }

      setOpenModal(false);
      setEditId(null);
      setFormData({
        name: "",
        description: "",
        category: "Regular Activities",
      });

      fetchActivities();
    } catch (error) {
      toast.error("Operation failed");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= CATEGORY ================= */

  const categories = [
    "Regular Activities",
    "Special Camps",
    "Suggestive Activities",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-display text-navy">
        Activities Management
      </h1>

      {categories.map((category) => {
        const filtered = activities.filter(
          (a) => a.category === category
        );

        return (
          <div key={category} className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-navy">
                {category}
              </h2>

              <button
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    name: "",
                    description: "",
                    category: category,
                  });
                  setOpenModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white hover:bg-navy-light transition"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="p-3 text-left">S.No</th>
                    <th className="p-3 text-left">Activity Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id} className="hover:bg-slate-50 border-t">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-medium text-navy">
                        {a.name}
                      </td>
                      <td className="p-3 text-slate-600">
                        {a.description}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-3">
                          {/* ✅ EDIT BUTTON */}
                          <button
                            onClick={() => {
                              setEditId(a.id);
                              setFormData({
                                name: a.name,
                                description: a.description,
                                category: a.category,
                              });
                              setOpenModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(a.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-center text-slate-500"
                      >
                        No activities found.
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-navy">
                {editId ? "Update Activity" : "Add Activity"}
              </h3>
              <button onClick={() => setOpenModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Activity Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-navy text-white py-2 rounded-lg hover:bg-navy-light flex justify-center items-center gap-2"
            >
              {submitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {submitting
                ? editId
                  ? "Updating..."
                  : "Adding..."
                : editId
                ? "Update Activity"
                : "Add Activity"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}