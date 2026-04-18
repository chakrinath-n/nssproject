import { useEffect, useState } from "react";
import api from "@/api/axios";

interface CampReport {
  id: number;
  nss_unit_code: string;
  title: string;
  event_start_date: string;
  event_end_date: string;
  male_volunteers: number;
  female_volunteers: number;
  description: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  news_clipping1: string;
  news_clipping2: string;
  created_at: string;
}

export default function ViewCampReports() {

  const [reports, setReports] = useState<CampReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CampReport | null>(null);
  const [previewPhotos, setPreviewPhotos] = useState<string[] | null>(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/officer/special-camps");
      setReports(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;
    try {
      await api.delete(`/officer/special-camps/${id}`);
      fetchReports();
    } catch {
      alert("Failed to delete report");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Special Camp Reports
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-400 text-center py-10">
          No reports found.
        </p>
      )}

      {reports.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Title</th>
                <th className="border px-3 py-2">Start Date</th>
                <th className="border px-3 py-2">End Date</th>
                <th className="border px-3 py-2">Male</th>
                <th className="border px-3 py-2">Female</th>
                <th className="border px-3 py-2">Total</th>
                <th className="border px-3 py-2">Photos</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => (
                <tr key={r.id} className="hover:bg-gray-50">

                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2 font-medium">{r.title}</td>
                  <td className="border px-3 py-2">{r.event_start_date?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{r.event_end_date?.slice(0, 10)}</td>
                  <td className="border px-3 py-2 text-center">{r.male_volunteers}</td>
                  <td className="border px-3 py-2 text-center">{r.female_volunteers}</td>
                  <td className="border px-3 py-2 text-center font-medium text-green-700">
                    {(r.male_volunteers || 0) + (r.female_volunteers || 0)}
                  </td>

                  {/* Photos */}
                  <td className="border px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {[r.photo1, r.photo2, r.photo3, r.photo4].map((photo, i) =>
                        photo ? (
                          <img
                            key={i}
                            src={`http://localhost:5000/uploads/${photo}`}
                            className="w-8 h-8 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() =>
                              setPreviewPhotos(
                                [r.photo1, r.photo2, r.photo3, r.photo4].filter(Boolean)
                              )
                            }
                          />
                        ) : null
                      )}
                      {!r.photo1 && !r.photo2 && !r.photo3 && !r.photo4 && (
                        <span className="text-gray-400 text-xs">No photos</span>
                      )}
                    </div>
                  </td>

                  <td className="border px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(r)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
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

      {/* ===== DETAIL MODAL ===== */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Camp Report Details</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setSelected(null)}
              >✕</button>
            </div>

            <div className="space-y-0 border rounded-lg overflow-hidden text-sm">
              {[
                ["Event Type", "Special Camps"],
                ["Title", selected.title],
                ["Start Date", selected.event_start_date?.slice(0, 10)],
                ["End Date", selected.event_end_date?.slice(0, 10)],
                ["Male Volunteers", selected.male_volunteers],
                ["Female Volunteers", selected.female_volunteers],
                ["Total Volunteers", (selected.male_volunteers || 0) + (selected.female_volunteers || 0)],
                ["Description", selected.description],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-2 border-b">
                  <div className="px-4 py-3 bg-gray-50 border-r font-medium text-gray-600">{label}</div>
                  <div className="px-4 py-3 text-gray-800">{value || "—"}</div>
                </div>
              ))}
            </div>

            {/* Event Photos */}
            <div className="mt-4">
              <p className="font-medium text-gray-600 mb-2">Event Photos:</p>
              <div className="flex gap-3 flex-wrap">
                {[selected.photo1, selected.photo2, selected.photo3, selected.photo4].map((photo, i) =>
                  photo ? (
                    <img
                      key={i}
                      src={`http://localhost:5000/uploads/${photo}`}
                      className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                      onClick={() =>
                        setPreviewPhotos(
                          [selected.photo1, selected.photo2, selected.photo3, selected.photo4].filter(Boolean)
                        )
                      }
                    />
                  ) : null
                )}
              </div>
            </div>

            {/* News Clippings */}
            {(selected.news_clipping1 || selected.news_clipping2) && (
              <div className="mt-4">
                <p className="font-medium text-gray-600 mb-2">News Clippings:</p>
                <div className="flex gap-3 flex-wrap">
                  {[selected.news_clipping1, selected.news_clipping2].map((clip, i) =>
                    clip ? (
                      <img
                        key={i}
                        src={`http://localhost:5000/uploads/${clip}`}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => setPreviewPhotos([clip])}
                      />
                    ) : null
                  )}
                </div>
              </div>
            )}

            <button
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg"
              onClick={() => setSelected(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ===== PHOTO PREVIEW MODAL ===== */}
      {previewPhotos && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Photos</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={() => setPreviewPhotos(null)}
              >✕</button>
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              {previewPhotos.map((photo, i) => (
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

    </div>
  );
}