import { useState } from "react";
import api from "@/api/axios";

export default function AddCampReport() {

  const [form, setForm] = useState({
    title: "",
    event_start_date: "",
    event_end_date: "",
    male_volunteers: "",
    female_volunteers: "",
    description: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    news_clipping1: null,
    news_clipping2: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files?.[0]) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.event_start_date || !form.event_end_date) {
      return setError("Title, start date and end date are required");
    }

    if (form.description.split(" ").length > 500) {
      return setError("Description must be max 500 words");
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      Object.entries(files).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      await api.post("/officer/special-camps/add", data);

      setSuccess("Special Camp Report submitted successfully!");
      setForm({
        title: "",
        event_start_date: "",
        event_end_date: "",
        male_volunteers: "",
        female_volunteers: "",
        description: "",
      });
      setFiles({
        photo1: null, photo2: null,
        photo3: null, photo4: null,
        news_clipping1: null, news_clipping2: null,
      });

    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">JNTUK NSS PORTAL</h1>
        <p className="text-sm text-gray-500 mt-1">Special Camps Report Submission</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-0">

          {/* NSS Unit Code - readonly */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Event Type:
            </div>
            <div className="px-4 py-3 text-sm text-gray-800">
              Special Camps
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Title of the Event:
            </div>
            <div className="px-4 py-3">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Event Start Date:
            </div>
            <div className="px-4 py-3">
              <input
                type="date"
                name="event_start_date"
                value={form.event_start_date}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-sm py-1"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Event End Date:
            </div>
            <div className="px-4 py-3">
              <input
                type="date"
                name="event_end_date"
                value={form.event_end_date}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Male Volunteers */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              No of Male Volunteers Involved:
            </div>
            <div className="px-4 py-3">
              <input
                type="number"
                name="male_volunteers"
                value={form.male_volunteers}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Female Volunteers */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              No of Female Volunteers Involved:
            </div>
            <div className="px-4 py-3">
              <input
                type="number"
                name="female_volunteers"
                value={form.female_volunteers}
                onChange={handleChange}
                placeholder="0"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Description of Programme
              <span className="block text-xs text-gray-400">(Max. 500 words)</span>
            </div>
            <div className="px-4 py-3">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter programme description..."
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-green-500 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.description.split(" ").filter(Boolean).length} / 500 words
              </p>
            </div>
          </div>

          {/* Photo 1 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload Event Photo-1
              <span className="block text-xs text-gray-400">(Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "photo1")}
                className="text-sm"
              />
            </div>
          </div>

          {/* Photo 2 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload Event Photo-2
              <span className="block text-xs text-gray-400">(Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "photo2")}
                className="text-sm"
              />
            </div>
          </div>

          {/* Photo 3 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload Event Photo-3
              <span className="block text-xs text-gray-400">(Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "photo3")}
                className="text-sm"
              />
            </div>
          </div>

          {/* Photo 4 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload Event Photo-4
              <span className="block text-xs text-gray-400">(Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e, "photo4")}
                className="text-sm"
              />
            </div>
          </div>

          {/* News Clipping 1 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload News Paper Clipping-1
              <span className="block text-xs text-gray-400">(JPG/JPEG format, Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept=".jpg,.jpeg"
                onChange={(e) => handleFile(e, "news_clipping1")}
                className="text-sm"
              />
            </div>
          </div>

          {/* News Clipping 2 */}
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Upload Paper Clipping-2
              <span className="block text-xs text-gray-400">(JPG/JPEG format, Max size: 400 KB)</span>
            </div>
            <div className="px-4 py-3">
              <input
                type="file"
                accept=".jpg,.jpeg"
                onChange={(e) => handleFile(e, "news_clipping2")}
                className="text-sm"
              />
            </div>
          </div>

        </div>

        {/* Error / Success */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded text-sm">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-300 text-green-600 px-4 py-2 rounded text-sm">
            ✅ {success}
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-8 py-2 rounded-lg font-medium transition"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>

      </form>
    </div>
  );
}