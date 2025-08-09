"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null); // Store full src (base64 or URL)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateImage() {
    setLoading(true);
    setError("");
    setImageSrc(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate the image");

      const data = await res.json();

      // Handle both base64 and direct URL
      if (data.imageBase64) {
        setImageSrc(`data:image/png;base64,${data.imageBase64}`);
      } else if (data.imageUrl) {
        setImageSrc(data.imageUrl);
      } else {
        throw new Error("No image data received from server");
      }

      setPrompt("");
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-black text-white flex flex-col items-center p-8">
      <h1 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 drop-shadow-lg glow">
        AI Image Generator
      </h1>

      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (error) setError("");
        }}
        placeholder="Describe your creative image idea..."
        className="w-full max-w-xl p-4 rounded-lg bg-black bg-opacity-50 border border-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-700 placeholder-purple-400 text-lg shadow-md transition"
      />

      <button
        onClick={generateImage}
        disabled={loading || prompt.trim().length === 0}
        className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-600 via-red-600 to-yellow-500 font-semibold rounded-lg shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
      >
        {loading ? "Creating masterpiece..." : "Generate Image"}
      </button>

      {error && (
        <p className="mt-4 text-red-400 font-semibold tracking-wide">{error}</p>
      )}

      <div className="mt-12 w-full max-w-xl">
        {imageSrc ? (
          <div className="perspective-1000">
            <div className="image-card bg-gradient-to-tr from-pink-700 via-red-600 to-yellow-400 rounded-xl shadow-2xl p-4 transform hover:rotate-y-6 hover:scale-105 transition-transform duration-700 ease-in-out cursor-pointer">
              <img
                src={imageSrc}
                alt="Generated AI"
                className="rounded-lg shadow-lg select-none"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-purple-300 italic mt-8 select-none">
            No image generated yet. Start by entering a creative prompt above!
          </p>
        )}
      </div>

      <div className="mt-16">
        <a
          href="/images"
          className="inline-block px-6 py-3 bg-indigo-700 rounded-full text-white font-semibold tracking-wide hover:bg-indigo-900 shadow-lg transition-colors"
        >
          View All Generated Images
        </a>
      </div>

      <style jsx>{`
        .glow {
          text-shadow: 0 0 10px rgba(255, 100, 150, 0.8),
            0 0 20px rgba(255, 50, 100, 0.6), 0 0 40px rgba(255, 0, 100, 0.4);
        }

        /* Perspective wrapper */
        .perspective-1000 {
          perspective: 1500px; /* Deeper 3D */
        }

        /* Image Card 3D Style */
        .image-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          border-radius: 1rem;
        }

        /* Hover 3D effect with parallax */
        .image-card:hover {
          transform: rotateY(20deg) rotateX(12deg) scale(1.08);
          box-shadow: 0 25px 50px rgba(255, 0, 150, 0.4);
        }

        /* Floating Animation */
        .image-card-floating {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotateY(0deg);
          }
          50% {
            transform: translateY(-8px) rotateY(2deg);
          }
        }

        /* Inner glow layer for a hologram effect */
        .image-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background: linear-gradient(
            135deg,
            rgba(255, 0, 150, 0.2),
            rgba(0, 200, 255, 0.2)
          );
          mix-blend-mode: screen;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .image-card:hover::after {
          opacity: 1;
        }
      `}</style>
    </main>
  );
}
