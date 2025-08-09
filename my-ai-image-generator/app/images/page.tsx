"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Image {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        // Filter out images with no imageUrl
        setImages(data.filter((img: Image) => img.imageUrl && img.imageUrl.trim() !== ""));
      })
      .finally(() => setLoading(false)); // Handle loading state
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Generated Images</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Generate Image
        </Link>
      </div>

      {/* Loading Animation */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-lg text-gray-400">No images generated yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images
            .filter((img) => img.imageUrl)
            .map((img) => (
              <div
                key={img.id}
                className="border rounded-lg p-2 shadow-lg bg-white hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              >
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-auto rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-700">Prompt: {img.prompt}</p>
                <p className="text-xs text-gray-400">
                  {new Date(img.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
