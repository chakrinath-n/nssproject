import { useEffect, useState } from "react";
import api from "@/api/axios";

interface Award {
  id: number;
  award_year: string;
  award_type: string;
  recipient_name: string;
  college_name: string;
  district: string;
  photo: string;
}

export default function NssAwardsPage() {

  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await api.get("/awards");
        setAwards(res.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  // Get unique years for filter
  const years = [...new Set(awards.map((a) => a.award_year))].sort((a, b) =>
    b.localeCompare(a)
  );

  // Filter by selected year
  const filtered = selectedYear === "all"
    ? awards
    : awards.filter((a) => a.award_year === selectedYear);

  // Group filtered by year then type
  const grouped = filtered.reduce((acc, award) => {
    const year = award.award_year;
    const type = award.award_type;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][type]) acc[year][type] = [];
    acc[year][type].push(award);
    return acc;
  }, {} as Record<string, Record<string, Award[]>>);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-950 text-white py-10 text-center">
        <h1 className="text-3xl font-bold">NSS Awards</h1>
        <p className="text-blue-300 mt-2 text-sm">
          JNTUK NSS — Recognizing excellence in service
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Intro */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            JNTUK NSS AWARDS
          </h2>
          <p className="text-gray-600 leading-relaxed text-justify">
            Jawaharlal Nehru Technological University Kakinada (JNTUK) presents university
            level Best NSS Programme Officer Awards in recognition of outstanding contribution
            of the Programme Officers to the community service. The University also presents
            Best Volunteer Awards to the student volunteers for their active participation in
            NSS activities. The following is the list of recipients of the university level
            NSS Awards by JNTUK.
          </p>
        </div>

        {/* ===== YEAR FILTER ===== */}
        <div className="bg-white rounded-xl shadow p-5 mb-8">
          <div className="flex items-center gap-4 flex-wrap">

            <label className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              Filter by Year:
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <p className="text-xs text-gray-400">
              Showing <strong>{filtered.length}</strong> award{filtered.length !== 1 ? "s" : ""}
              {selectedYear !== "all" ? ` for ${selectedYear}` : " across all years"}
            </p>

          </div>
        </div>

        {/* Awards by Year and Type */}
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No awards found{selectedYear !== "all" ? ` for ${selectedYear}` : ""}.
          </p>
        ) : (
          Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, types]) => (
              <div key={year} className="mb-10">

                {/* Year heading - only show when viewing all */}
                {selectedYear === "all" && (
                  <h2 className="text-xl font-bold text-blue-950 mb-4 pl-1">
                    📅 {year}
                  </h2>
                )}

                {Object.entries(types).map(([type, list]) => (
                  <div
                    key={type}
                    className="bg-white rounded-xl shadow overflow-hidden mb-6"
                  >

                    {/* Type Header */}
                    <div className="text-center py-4 border-b bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800">
                        {type} {year}
                      </h3>
                    </div>

                    {/* Awards Table */}
                    <table className="w-full text-sm">
                      <tbody>
                        {list.map((award, index) => (
                          <tr
                            key={award.id}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4 w-12 text-gray-500 font-medium">
                              {index + 1}.
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {award.recipient_name}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {award.college_name}
                              {award.district ? `, ${award.district}` : ""}
                            </td>
                            <td className="px-6 py-4 w-20">
                              {award.photo ? (
                                <img
                                  src={`${import.meta.env.VITE_API_URL}/uploads/${award.photo}`}
                                  className="w-14 h-14 object-cover rounded shadow"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                  No Photo
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                ))}

              </div>
            ))
        )}

      </div>
    </div>
  );
}