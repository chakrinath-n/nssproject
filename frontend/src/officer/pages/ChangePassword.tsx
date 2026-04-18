import { useState } from "react";
import api from "@/api/axios";

export default function ChangePassword() {

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return setError("All fields are required");
    }

    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    if (form.oldPassword === form.newPassword) {
      return setError("New password must be different from current password");
    }

    setLoading(true);

    try {

      // ✅ PUT method, matching your route
      // ✅ oldPassword / newPassword matching your controller
      await api.put("/officer/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      setSuccess("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">

      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Change Password
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Current Password */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Current Password
          </label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-600 px-4 py-2 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white py-2 rounded-lg font-medium transition"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>

      </form>

    </div>
  );
}