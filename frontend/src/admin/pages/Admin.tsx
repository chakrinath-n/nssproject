import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  type Admin,
} from "../services/admin.api";

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin", // ✅ Fixed default role
  });

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins();
      setAdmins(response.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAdmin) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await updateAdmin(editingAdmin.id, updateData);
        toast.success("Admin updated successfully");
      } else {
        await createAdmin(formData);
        toast.success("Admin created successfully");
      }

      fetchAdmins();
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save admin");
      console.error("Error saving admin:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      await deleteAdmin(id);
      toast.success("Admin deleted successfully");
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to delete admin");
      console.error("Error deleting admin:", error);
    }
  };

  const openModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name || "",
        email: admin.email,
        password: "",
        role: admin.role, // ✅ Uses correct DB value
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Admin", // ✅ Correct default
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Admin",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-navy">Admins</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition"
        >
          <Plus size={18} /> Add Admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">
                Role
              </th>
              <th className="px-4 py-3 text-sm font-medium text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-navy">
                  {admin.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {admin.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      admin.role === "Super Admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(admin)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {admins.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No admins found. Add your first admin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-navy">
                {editingAdmin ? "Edit Admin" : "Add Admin"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password{" "}
                  {editingAdmin && "(leave empty to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:outline-none"
                  required={!editingAdmin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">
                    Super Admin
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingAdmin ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}