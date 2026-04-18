import { useEffect, useState } from "react";
import api from "@/api/axios";

interface SocialData {
  officer_name: string;
  officer_phone: string;
  officer_gender: string;
  officer_aadhaar: string;
  officer_blood_group: string;
  officer_teaching_subject: string;
  officer_experience: string;
  officer_eti_status: string;
  nss_unit_code: string;
  college_name: string;
  district: string;
  state: string;
  university_name: string;
  college_address: string;
  college_phone: string;
  college_email: string;
  links: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    snapchat?: string;
    linkedin?: string;
    profile_image?: string;
  } | null;
}

type FormState = Omit<SocialData, "nss_unit_code" | "links"> & {
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  snapchat: string;
  linkedin: string;
};

/* ── Reusable editable row ── */
function EditRow({
  label,
  name,
  value,
  placeholder,
  onChange,
  isLast = false,
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLast?: boolean;
}) {
  return (
    <div className={`grid grid-cols-2 ${!isLast ? "border-b" : ""}`}>
      <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
        {label}
      </div>
      <div className="px-4 py-3">
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label}`}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm py-1 bg-transparent"
        />
      </div>
    </div>
  );
}

/* ── Select row for dropdowns ── */
function SelectRow({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div className="grid grid-cols-2 border-b">
      <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
        {label}
      </div>
      <div className="px-4 py-3">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm py-1 bg-transparent"
        >
          <option value="">— Select —</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ── Read-only row ── */
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-2 border-b">
      <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
        {label}
      </div>
      <div className="px-4 py-3 text-sm text-gray-800">{value || "—"}</div>
    </div>
  );
}

/* ── Section header stripe ── */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 tracking-wide">
      {title}
    </div>
  );
}

/* ─────────────────────────────── */

const INITIAL_FORM: FormState = {
  officer_name: "", officer_phone: "", officer_gender: "",
  officer_aadhaar: "", officer_blood_group: "", officer_teaching_subject: "",
  officer_experience: "", officer_eti_status: "",
  college_name: "", district: "", state: "", university_name: "",
  college_address: "", college_phone: "", college_email: "",
  twitter: "", facebook: "", instagram: "",
  youtube: "", snapchat: "", linkedin: "",
};

export default function SocialLinks() {
  const [data, setData]             = useState<SocialData | null>(null);
  const [form, setForm]             = useState<FormState>(INITIAL_FORM);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [saving, setSaving]         = useState(false);

  useEffect(() => { fetchData(); }, []);

  /* ── Populate form from API response ── */
  const buildForm = (d: SocialData): FormState => ({
    officer_name:             d.officer_name             || "",
    officer_phone:            d.officer_phone            || "",
    officer_gender:           d.officer_gender           || "",
    officer_aadhaar:          d.officer_aadhaar          || "",
    officer_blood_group:      d.officer_blood_group      || "",
    officer_teaching_subject: d.officer_teaching_subject || "",
    officer_experience:       d.officer_experience       || "",
    officer_eti_status:       d.officer_eti_status       || "",
    college_name:             d.college_name             || "",
    district:                 d.district                 || "",
    state:                    d.state                    || "",
    university_name:          d.university_name          || "",
    college_address:          d.college_address          || "",
    college_phone:            d.college_phone            || "",
    college_email:            d.college_email            || "",
    twitter:                  d.links?.twitter           || "",
    facebook:                 d.links?.facebook          || "",
    instagram:                d.links?.instagram         || "",
    youtube:                  d.links?.youtube           || "",
    snapchat:                 d.links?.snapchat          || "",
    linkedin:                 d.links?.linkedin          || "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/officer/social-links");
      setData(res.data);
      setForm(buildForm(res.data));
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (profileImage) formData.append("profile_image", profileImage);
      await api.put("/officer/social-links", formData);
      setSuccess("Profile updated successfully!");
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (data) setForm(buildForm(data));
    setProfileImage(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">JNTUK NSS PORTAL</h1>
        {data && (
          <p className="text-sm text-gray-500 mt-1">
            Welcome {data.college_name} (NSS Unit Code: {data.nss_unit_code})
          </p>
        )}
        <p className="text-sm font-medium text-gray-600 mt-2">
          Update Your Profile &amp; Social Links
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="border rounded-lg overflow-hidden">

          {/* ── NSS Unit Info (Unit code is read-only) ── */}
          <SectionHeader title="NSS Unit Information" />
          <InfoRow label="NSS Unit Code" value={data?.nss_unit_code} />
          <EditRow label="NSS Unit Name"    name="college_name"    value={form.college_name}    onChange={handleChange} />
          <EditRow label="District"         name="district"        value={form.district}        onChange={handleChange} />
          <EditRow label="State"            name="state"           value={form.state}           onChange={handleChange} />
          <EditRow label="University Name"  name="university_name" value={form.university_name} onChange={handleChange} />

          {/* ── College Info ── */}
          <SectionHeader title="College Information" />
          <EditRow label="College Address"  name="college_address" value={form.college_address} onChange={handleChange} />
          <EditRow label="College Phone"    name="college_phone"   value={form.college_phone}   onChange={handleChange} />
          <EditRow label="College Email"    name="college_email"   value={form.college_email}   onChange={handleChange} />

          {/* ── Officer Details ── */}
          <SectionHeader title="Programme Officer Details" />
          <EditRow label="Officer Name"       name="officer_name"             value={form.officer_name}             onChange={handleChange} />
          <EditRow label="Phone Number"       name="officer_phone"            value={form.officer_phone}            onChange={handleChange} />
          <SelectRow
            label="Gender" name="officer_gender" value={form.officer_gender}
            options={["Male", "Female", "Other"]}
            onChange={handleChange}
          />
          <EditRow label="Aadhaar Number"     name="officer_aadhaar"          value={form.officer_aadhaar}          onChange={handleChange} />
          <SelectRow
            label="Blood Group" name="officer_blood_group" value={form.officer_blood_group}
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            onChange={handleChange}
          />
          <EditRow label="Teaching Subject"   name="officer_teaching_subject" value={form.officer_teaching_subject} onChange={handleChange} />
          <EditRow label="Experience"         name="officer_experience"       value={form.officer_experience}       onChange={handleChange} />
          <SelectRow
            label="ETI Status" name="officer_eti_status" value={form.officer_eti_status}
            options={["Completed", "Pending", "Exempted"]}
            onChange={handleChange}
          />

          {/* ── Profile Image ── */}
          <SectionHeader title="Profile Image" />
          <div className="grid grid-cols-2 border-b">
            <div className="px-4 py-3 bg-gray-50 border-r font-medium text-sm text-gray-600">
              Profile Image
              <span className="block text-xs text-gray-400">(JPG/PNG, Max 400KB)</span>
            </div>
            <div className="px-4 py-3 flex items-center gap-4">
              {(imagePreview || data?.links?.profile_image) && (
                <img
                  src={
                    imagePreview ||
                    `http://localhost:5000/uploads/${data?.links?.profile_image}`
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="text-sm"
              />
            </div>
          </div>

          {/* ── Social Links ── */}
          <SectionHeader title="Social Media Links" />
          <EditRow label="Twitter Link"   name="twitter"   value={form.twitter}   placeholder="https://twitter.com/..."  onChange={handleChange} />
          <EditRow label="Facebook Link"  name="facebook"  value={form.facebook}  placeholder="https://facebook.com/..." onChange={handleChange} />
          <EditRow label="Instagram Link" name="instagram" value={form.instagram} placeholder="https://instagram.com/..."onChange={handleChange} />
          <EditRow label="YouTube Link"   name="youtube"   value={form.youtube}   placeholder="https://youtube.com/..."  onChange={handleChange} />
          <EditRow label="Snapchat Link"  name="snapchat"  value={form.snapchat}  placeholder="https://snapchat.com/..."  onChange={handleChange} />
          <EditRow label="LinkedIn Link"  name="linkedin"  value={form.linkedin}  placeholder="https://linkedin.com/..." onChange={handleChange} isLast />

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

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}