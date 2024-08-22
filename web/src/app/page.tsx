"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100 relative overflow-hidden">
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,

          backgroundImage: 'url(/back.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backdropFilter: 'blur(10px)', // Add blur effect directly
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>

      {/* Left Section */}
      <div className="flex w-full relative">
        <div className="w-1/2 flex flex-col justify-center items-start p-8">
          <p className="text-sm text-black mb-2">E-LIBRARY</p>
          <h1 className="text-5xl text-white font-bold mb-6">Discover Your Next Read</h1>
          <p className="text-lg mb-6  text-white">
            Explore a vast collection of books from various genres. Whether you
            are looking for the latest bestsellers or classic literature, our
            e-library has something for everyone. Sign up now to start borrowing
            or browsing our catalog.
          </p>
          <Link href="/categories">
            <button
              className="bg-white text-dark-green px-6 py-3 border border-dark-green font-semibold hover:bg-dark-green hover:text-white transition-colors duration-300"
            >
              GET STARTED
            </button>
          </Link>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8">
          <div className="grid grid-cols-1 gap-4">
            <Image
              src="/home.png"
              alt="Featured Book"
              className="object-cover w-full h-full rounded-lg"
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
