import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  type Notification,
} from "../services/notification.api";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: "",
    link: "",
    category: "",
    is_scrolling: false,
    is_active: true,
    file: null,
  });

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append("link", formData.link);
      payload.append("category", formData.category);
      payload.append("is_scrolling", String(formData.is_scrolling));
      payload.append("is_active", String(formData.is_active));

      if (formData.file) {
        payload.append("file", formData.file);
      }

      if (editingNotification) {
        await updateNotification(editingNotification.id, payload);
        toast.success("Notification updated successfully");
      } else {
        await createNotification(payload);
        toast.success("Notification created successfully");
      }

      fetchNotifications();
      closeModal();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save notification"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      await deleteNotification(id);
      toast.success("Notification deleted successfully");
      fetchNotifications();
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const openModal = (notification?: Notification) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({
        title: notification.title,
        link: notification.link || "",
        category: notification.category || "",
        is_scrolling: notification.is_scrolling,
        is_active: notification.is_active,
        file: null,
      });
    } else {
      setEditingNotification(null);
      setFormData({
        title: "",
        link: "",
        category: "",
        is_scrolling: false,
        is_active: true,
        file: null,
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotification(null);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-navy">Notifications</h1>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy text-white"
        >
          <Plus className="w-4 h-4" />
          Add Notification
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">S.No</th>
              <th className="px-4 py-3 text-left text-sm">Title</th>
              <th className="px-4 py-3 text-left text-sm">Category</th>
              <th className="px-4 py-3 text-left text-sm">Status</th>
              <th className="px-4 py-3 text-center text-sm">Actions</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map((notification, index) => (
              <tr key={notification.id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{notification.title}</td>
                <td className="px-4 py-3">
                  {notification.category || "General"}
                </td>
                <td className="px-4 py-3">
                  {notification.is_active ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-blue-600"
                    onClick={() => openModal(notification)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-600"
                    onClick={() => handleDelete(notification.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingNotification
                  ? "Edit Notification"
                  : "Add Notification"}
              </h2>
              <X className="cursor-pointer" onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
                required
              />

              <input
                type="url"
                placeholder="Optional Link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />

              {/* Styled File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload File (PDF/Image)
                </label>

                <label className="cursor-pointer inline-block bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg border text-sm">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        file: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>

                {formData.file && (
                  <p className="text-xs text-slate-500 mt-2">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>

                <button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}