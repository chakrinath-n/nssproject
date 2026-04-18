import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "@/api/axios";

interface ActivityDetail {
  id: number;
  activity_name: string;
  description: string;
  activity_type_name: string;
  event_date: string;
  end_date: string;
  volunteers_count: number;
  location: string;
  college_name: string;
  nss_unit_code: string;
  district: string;
  photo1: string;
  photo2: string;
  photo3: string;
}

export default function UnitActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Get state passed from previous page
  const prevState = location.state as { unitCode?: string; selectedYear?: string } | null;

  const fetchDetail = useCallback(async () => {
    try {
      const res = await api.get(`/officer/public/activities/detail/${id}`);
      setActivity(res.data);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const formatDate = (date: string) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit", month: "2-digit", year: "2-digit",
        })
      : "—";

  /* ✅ Back handler - go back with unit code preserved */
  const handleBack = () => {
    if (prevState?.unitCode) {
      navigate("/unit-activities", {
        state: {
          unitCode: prevState.unitCode,
          selectedYear: prevState.selectedYear,
          autoSearch: true,
        },
      });
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!activity) return (
    <div className="p-10 text-center text-red-500">Activity not found.</div>
  );

  const photos = [activity.photo1, activity.photo2, activity.photo3].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <tbody>

              {/* Back + Header */}
              <tr>
                <td className="border px-4 py-3 w-28">
                  <button
                    onClick={handleBack}
                    className="text-blue-600 hover:underline font-medium whitespace-nowrap"
                  >
                    ← Back
                  </button>
                </td>
                <td className="border px-4 py-3 font-bold text-center text-gray-800" colSpan={3}>
                  NATIONAL SERVICE SCHEME, JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY KAKINADA
                </td>
              </tr>

              {/* Activity conducted by */}
              <tr>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Activity conducted by
                </td>
                <td className="border px-4 py-3 font-semibold text-gray-800" colSpan={3}>
                  {activity.nss_unit_code} - {activity.college_name}
                  {activity.district ? `, ${activity.district}` : ""}
                </td>
              </tr>

              {/* ✅ Activity Type + Title PARALLEL */}
              <tr>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Activity Type
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {activity.activity_type_name || "—"}
                </td>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Title of the Event
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {activity.activity_name}
                </td>
              </tr>

              {/* ✅ Start Date + End Date PARALLEL */}
              <tr>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Event Start Date:
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {formatDate(activity.event_date)}
                </td>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Event End Date:
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {formatDate(activity.end_date)}
                </td>
              </tr>

              {/* ✅ Volunteers + Location PARALLEL */}
              <tr>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Volunteers involved:
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {activity.volunteers_count || "—"}
                </td>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Location:
                </td>
                <td className="border px-4 py-3 font-bold text-gray-800">
                  {activity.location || "—"}
                </td>
              </tr>

              {/* Description */}
              <tr>
                <td className="border px-4 py-3 text-gray-600 bg-gray-50 whitespace-nowrap">
                  Description
                </td>
                <td className="border px-4 py-3 text-gray-700" colSpan={3}>
                  {activity.description || "—"}
                </td>
              </tr>

            </tbody>
          </table>

          {/* Photos */}
          {photos.length > 0 && (
            <div className="p-6 border-t">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Event Photos:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/uploads/${photo}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 shadow"
                    onClick={() => setPreview(photo)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Fullscreen Preview */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreview(null)}
          >
            <img
              src={`http://localhost:5000/uploads/${preview}`}
              className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
            />
          </div>
        )}

      </div>
    </div>
  );
}