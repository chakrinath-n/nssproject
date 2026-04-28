import { useState, useEffect } from "react";
import { Image as ImageIcon, X, Loader2, ZoomIn } from "lucide-react";
import { getImages, type Image } from "@/api/public";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getImages();
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // ✅ SAFE: handle missing created_at
  const getYear = (img: Image): string => {
    const date = (img as any).created_at;
    if (!date) return "Unknown";
    return new Date(date).getFullYear().toString();
  };

  // ✅ Extract unique years
  const years = Array.from(new Set(images.map((img) => getYear(img))));

  // ✅ Filter images
  const filteredImages =
    selectedYear === "all"
      ? images
      : images.filter((img) => getYear(img) === selectedYear);

  if (loading) {
    return (
      <section className="py-20 bg-blue-50">
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-blue-50">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Photo <span className="text-blue-500">Gallery</span>
        </h1>
        <p className="text-blue-700">
          Explore our events and activities
        </p>
      </div>

      {/* YEAR FILTER */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedYear("all")}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedYear === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"
          }`}
        >
          All
        </button>

        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedYear === year
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredImages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <ImageIcon className="w-12 h-12 mx-auto text-blue-300 mb-4" />
            <p>No images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* IMAGE */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`${BASE_URL}${image.url}`}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-52 object-cover"
                  />

                  {/* Hover Zoom */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition">
                    <ZoomIn className="text-white" />
                  </div>
                </div>

                {/* DESCRIPTION BELOW */}
                <div className="p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {image.caption || "No description"}
                  </p>

                  {/* YEAR DISPLAY */}
                  <p className="text-xs text-gray-500 mt-1">
                    Year: {getYear(image)}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <X
            className="absolute top-6 right-6 text-white cursor-pointer"
            onClick={() => setSelectedImage(null)}
          />

          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={`${BASE_URL}${selectedImage.url}`}
              className="max-h-[80vh] rounded"
            />

            <p className="text-white text-center mt-4">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}