import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X, Link } from "lucide-react";
import toast from "react-hot-toast";

import {
  getReports,
  deleteReport,
  createReport,
  type Report,
} from "../services/report.api";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    report_id: "",
    name: "",
    description: "",
    external_url: "",
  });

  /* ================= FETCH REPORTS ================= */

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data);
    } catch {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* ================= CREATE REPORT ================= */

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("report_id", formData.report_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("external_url", formData.external_url);

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      await createReport(formDataToSend);

      toast.success("Report added successfully");

      setFormData({
        report_id: "",
        name: "",
        description: "",
        external_url: "",
      });

      setSelectedFile(null);
      setIsModalOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add report"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await deleteReport(id);
      toast.success("Report deleted successfully");
      fetchReports();
    } catch {
      toast.error("Failed to delete report");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-900">
          Reports Management
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          <Plus size={18} />
          Add Report
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-green-50 text-green-900">
            <tr>
              <th className="p-3 text-left">S.No</th>
              <th className="p-3 text-left">Report ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">File / URL</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, index) => (
              <tr
                key={report.id}
                className="border-t hover:bg-green-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{report.report_id}</td>
                <td className="p-3 font-semibold text-green-900">
                  {report.name}
                </td>

                <td className="p-3">
                  {report.file_url ? (
                    <a
                      href={
                        report.file_url.startsWith("http")
                          ? report.file_url
                          : `${BASE_URL}${report.file_url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-green-700 hover:underline"
                    >
                      <Link size={16} />
                      View Report
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No reports found. Add your first report.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-900">
                Add Report
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Report ID"
                required
                value={formData.report_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    report_id: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Report Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg"
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
                className="w-full border px-3 py-2 rounded-lg"
              />

              {/* CUSTOM FILE BUTTON */}
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Upload File (PDF/Image)
                </label>

                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center justify-center px-5 py-2 border-2 border-green-700 text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition">
                    Choose File
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) =>
                        setSelectedFile(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  {selectedFile && (
                    <span className="text-sm text-green-700 font-medium truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* OPTIONAL URL */}
              <input
                type="url"
                placeholder="Or Enter External URL (Optional)"
                value={formData.external_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    external_url: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
                >
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