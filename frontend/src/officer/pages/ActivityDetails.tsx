import { useEffect, useState } from "react";
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
  paper_clipping1: string;
  paper_clipping2: string;
}

export default function ActivityDetails() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewPhotos, setPreviewPhotos] = useState<{
    images: string[];
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await api.get("/officer/activities");
      setActivities(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activities.filter(
    (a) =>
      a.activity_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.activity_type_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        View Activity Details
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, type or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded-lg mb-6 w-80"
      />

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-10">No activities found.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Activity Name</th>
                <th className="border px-3 py-2">Type</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Start Date</th>
                <th className="border px-3 py-2">End Date</th>
                <th className="border px-3 py-2">Volunteers</th>
                <th className="border px-3 py-2">Location</th>
                <th className="border px-3 py-2">Photos</th>
                <th className="border px-3 py-2">Paper Clippings</th> {/* ✅ NEW */}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, index) => (
                <tr key={a.id} className="hover:bg-gray-50">

                  <td className="border px-3 py-2 text-center">{index + 1}</td>

                  <td className="border px-3 py-2 font-medium">{a.activity_name}</td>

                  <td className="border px-3 py-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {a.activity_type_name || "—"}
                    </span>
                  </td>

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
                            className="relative group cursor-pointer"
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
                            {/* small label */}
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
              >
                ✕
              </button>
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
    </div>
  );
}