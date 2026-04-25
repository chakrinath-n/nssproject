import { useState, useEffect } from "react";
import { Pencil, Trash2, Upload, Eye, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getImages,
  createImage,
  updateImage,
  deleteImage,
  type ImageType,
} from "../services/image.api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Images() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchImages = async () => {
    try {
      const response = await getImages();
      setImages(response.data);
    } catch {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingImage) {
        await updateImage(editingImage.id, {
          caption,
          category: category || null,
        });
        toast.success("Image updated successfully");
      } else {
        if (!selectedFile) {
          toast.error("Please select an image file");
          return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("image", selectedFile);

        if (category) {
          formData.append("category", category);
        }

        await createImage(formData);
        toast.success("Image uploaded successfully");
      }

      fetchImages();
      closeModal();
    } catch {
      toast.error("Failed to save image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteImage(id);
      toast.success("Image deleted successfully");
      fetchImages();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const openModal = (image?: ImageType) => {
    if (image) {
      setEditingImage(image);
      setCaption(image.caption || "");
      setCategory(image.category || "");
    } else {
      setEditingImage(null);
      setCaption("");
      setCategory("");
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setCaption("");
    setCategory("");
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-navy">Images</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg"
        >
          <Upload className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">S.No</th>
              <th className="px-4 py-3 text-left text-sm">Preview</th>
              <th className="px-4 py-3 text-left text-sm">Caption</th>
              <th className="px-4 py-3 text-left text-sm">Category</th>
              <th className="px-4 py-3 text-left text-sm">Path</th>
              <th className="px-4 py-3 text-center text-sm">Actions</th>
            </tr>
          </thead>

          <tbody>
            {images.map((img, index) => (
              <tr key={img.id} className="border-t">
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3">
                  <img
                    src={`${BASE_URL}${img.url}`}
                    className="h-12 w-16 object-cover rounded"
                  />
                </td>

                <td className="px-4 py-3">
                  {img.caption || "No caption"}
                </td>

                <td className="px-4 py-3">
                  {img.category || "-"}
                </td>

                <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-xs">
                  {img.url}
                </td>

                <td className="px-4 py-3 flex justify-center gap-3">
                  <Eye className="w-4 h-4 text-emerald-600 cursor-pointer" />
                  <Pencil
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                    onClick={() => openModal(img)}
                  />
                  <Trash2
                    className="w-4 h-4 text-red-600 cursor-pointer"
                    onClick={() => handleDelete(img.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingImage ? "Edit Image" : "Upload Image"}
              </h2>
              <X className="cursor-pointer" onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingImage && (
                <div>
                  <label className="block text-sm mb-1">Select Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-1">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Category (optional)</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-navy text-white rounded-lg flex items-center gap-2"
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingImage ? "Update" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}