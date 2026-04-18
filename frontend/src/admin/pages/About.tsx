import { useEffect, useState } from "react";
import api from "@/api/axios";
import toast from "react-hot-toast";

interface Team {
  id: number;
  name: string;
  designation: string;
  image_url: string;
}

export default function About() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [team, setTeam] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    image: null as File | null,
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await api.get("/about"); // ✅ correct
      setTitle(res.data.about?.title || "");
      setContent(res.data.about?.content || "");
      setTeam(res.data.team || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load About data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SAVE ABOUT ================= */

  const saveAbout = async () => {
    try {
      setLoading(true);
      await api.put("/about", { title, content }); // ✅ correct
      toast.success("About updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update About");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD MEMBER ================= */

  const addMember = async () => {
    if (!newMember.name || !newMember.designation) {
      toast.error("Name and Designation required");
      return;
    }

    if (!newMember.image) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newMember.name);
      formData.append("designation", newMember.designation);
      formData.append("image", newMember.image);

      await api.post("/about/team", formData); // ✅ correct

      toast.success("Member added successfully");

      setNewMember({
        name: "",
        designation: "",
        image: null,
      });

      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add member");
    }
  };

  /* ================= DELETE MEMBER ================= */

  const deleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/about/team/${id}`); // ✅ correct
      toast.success("Member deleted successfully");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-navy">
        About Page Management
      </h1>

      {/* About Section */}
      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">About Content</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <textarea
          rows={6}
          placeholder="About Description"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          onClick={saveAbout}
          disabled={loading}
          className="bg-navy text-white px-6 py-2 rounded"
        >
          {loading ? "Saving..." : "Save About"}
        </button>
      </div>

      {/* Team Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          NSS Team Members
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow text-center"
            >
              <img
                src={`http://localhost:5000${member.image_url}`}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
              <h3 className="mt-3 font-semibold">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500">
                {member.designation}
              </p>

              <button
                onClick={() => deleteMember(member.id)}
                className="mt-3 text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add Member */}
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h3 className="font-semibold">Add New Member</h3>

          <input
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            className="border p-3 rounded w-full"
          />

          <input
            placeholder="Designation"
            value={newMember.designation}
            onChange={(e) =>
              setNewMember({
                ...newMember,
                designation: e.target.value,
              })
            }
            className="border p-3 rounded w-full"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewMember({
                ...newMember,
                image: e.target.files?.[0] || null,
              })
            }
            className="border p-3 rounded w-full"
          />

          <button
            onClick={addMember}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}