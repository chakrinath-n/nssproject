import { useState } from "react";
import api from "@/api/axios";

interface VolunteerForm {
  hallticket_no?: string;
  student_name?: string;
  dob?: string;
  course?: string;
  year?: string;
  semester?: string;
  gender?: string;
  category?: string;
  contact_number?: string;
  blood_group?: string;
  email?: string;
  aadhaar_number?: string;
  nss_group_number?: string;
  father_name?: string;
  father_occupation?: string;
  address?: string;
  permanent_address?: string;
  willing_donate_blood?: string;
  entry_date?: string;
}

export default function AddVolunteer() {

const [form, setForm] = useState<VolunteerForm>({});
const [photo, setPhoto] = useState<File | null>(null);
const [sameAddress, setSameAddress] = useState(false);

/* ================= INPUT CHANGE ================= */

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
};

/* ================= PHOTO ================= */

const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setPhoto(e.target.files[0]);
  }
};

/* ================= SAME ADDRESS ================= */

const handleSameAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
  const checked = e.target.checked;
  setSameAddress(checked);
  if (checked) {
    setForm(prev => ({ ...prev, permanent_address: prev.address }));
  } else {
    setForm(prev => ({ ...prev, permanent_address: "" }));
  }
};

/* ================= SUBMIT ================= */

const submitVolunteer = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const data = new FormData();

    // Append form fields
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    // Append photo
    if (photo) {
      data.append("photo", photo);
    }

    // ✅ No manual token needed - axios interceptor handles it automatically
    await api.post("/officer/volunteers/add", data);

    alert("Volunteer Registered Successfully");
    setForm({});
    setPhoto(null);
    setSameAddress(false);

  } catch (error: any) {
    console.error("Error:", error?.response?.data);
    alert(`Submission Failed: ${error?.response?.data?.message || error.message}`);
  }
};

/* ================= UI ================= */

return (
  <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl">

    <h1 className="text-2xl font-bold text-gray-800 mb-8">
      Add Volunteer Form
    </h1>

    <form onSubmit={submitVolunteer}>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Hallticket */}
        <div>
          <label className="text-sm font-medium text-gray-600">Hallticket No</label>
          <input
            name="hallticket_no"
            value={form.hallticket_no || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Student Name */}
        <div>
          <label className="text-sm font-medium text-gray-600">Student Name</label>
          <input
            name="student_name"
            value={form.student_name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-medium text-gray-600">Date Of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Course */}
        <div>
          <label className="text-sm font-medium text-gray-600">Course</label>
          <input
            name="course"
            value={form.course || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Year */}
        <div>
          <label className="text-sm font-medium text-gray-600">Year</label>
          <input
            name="year"
            value={form.year || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="text-sm font-medium text-gray-600">Semester</label>
          <input
            name="semester"
            value={form.semester || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-gray-600">Gender</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-600">Reservation Category</label>
          <select
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="">Select Category</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="BC">BC</option>
            <option value="OC">OC</option>
          </select>
        </div>

        {/* Contact */}
        <div>
          <label className="text-sm font-medium text-gray-600">Contact Number</label>
          <input
            name="contact_number"
            value={form.contact_number || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="text-sm font-medium text-gray-600">Blood Group</label>
          <select
            name="blood_group"
            value={form.blood_group || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>B+</option>
            <option>O+</option>
            <option>AB+</option>
            <option>A-</option>
            <option>B-</option>
            <option>O-</option>
            <option>AB-</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600">Email Id</label>
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="text-sm font-medium text-gray-600">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Aadhaar */}
        <div>
          <label className="text-sm font-medium text-gray-600">Aadhaar Number</label>
          <input
            name="aadhaar_number"
            value={form.aadhaar_number || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* NSS Group */}
        <div>
          <label className="text-sm font-medium text-gray-600">NSS Group Number</label>
          <input
            name="nss_group_number"
            value={form.nss_group_number || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Father Name */}
        <div>
          <label className="text-sm font-medium text-gray-600">Father Name</label>
          <input
            name="father_name"
            value={form.father_name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Father Occupation */}
        <div>
          <label className="text-sm font-medium text-gray-600">Father Occupation</label>
          <input
            name="father_occupation"
            value={form.father_occupation || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Same Address Checkbox */}
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={handleSameAddress}
          />
          <label>Permanent Address same as Address</label>
        </div>

        {/* Permanent Address */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Permanent Address</label>
          <textarea
            name="permanent_address"
            value={form.permanent_address || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        {/* Willing Donate Blood */}
        <div>
          <label className="text-sm font-medium text-gray-600">Willing Donate Blood</label>
          <select
            name="willing_donate_blood"
            value={form.willing_donate_blood || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Entry Date */}
        <div>
          <label className="text-sm font-medium text-gray-600">Entry Date</label>
          <input
            type="date"
            name="entry_date"
            value={form.entry_date || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

      </div>

      <button
        type="submit"
        className="mt-8 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg"
      >
        Register
      </button>

    </form>

  </div>
);

}