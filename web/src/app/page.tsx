"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gray-100 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/back.jpg)" }}>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-7xl flex flex-col-reverse lg:flex-row items-center gap-10">
        
        {/* Left Section (Text) */}
        <div className="w-full lg:w-1/2 text-center lg:text-left px-6">
          <p className="text-sm text-gray-300">E-LIBRARY</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mt-2">
            Discover Your Next Read
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            Explore a vast collection of books from various genres. Whether you
            are looking for the latest bestsellers or classic literature, our
            e-library has something for everyone. Sign up now to start browsing
            our catalog...
          </p>
          <div className="mt-6">
            <Link href="/categories">
              <button className="bg-white text-dark-green px-6 py-3 border border-dark-green font-semibold hover:bg-dark-green hover:text-white transition">
                GET STARTED
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src="/home.png"
            alt="Featured Book"
            className="object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-lg"
            width={500}
            height={300}
            priority
          />
        </div>
      </div>
    </main>
  );
}
