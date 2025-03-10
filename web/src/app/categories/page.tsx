"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Categories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    { name: "Fiction", image: "/fiction.png", description: "Explore imaginative storytelling in Fiction books.", link: "/categories/Fiction" },
    { name: "Non-Fiction", image: "/non-fiction.png", description: "Discover real-life stories and factual books.", link: "/categories/non-fiction" },
    { name: "Science", image: "/science.png", description: "Delve into the world of science and discoveries.", link: "/categories/science" },
    { name: "History", image: "/history.jpg", description: "Learn about the events that shaped our world.", link: "/categories/history" },
    { name: "Biography", image: "/biography.jpg", description: "Read the life stories of famous personalities.", link: "/categories/biography" },
    { name: "Fantasy", image: "/fantacy.jpg", description: "Enter magical realms with our Fantasy books.", link: "/categories/fantasy" },
  ];

  return (
    <main className="relative min-h-screen p-16 bg-gray-100">
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/back.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        />
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-10 text-white text-center relative z-10">
        BOOK CATEGORIES
      </h1>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {categories.map((category, index) => (
          <Link href={category.link} key={index}>
            <div
              className={`relative flex flex-col items-center p-4 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer ${
                hoveredIndex === index ? "shadow-2xl" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-48 mb-4 rounded"
                width={300}
                height={200}
              />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
