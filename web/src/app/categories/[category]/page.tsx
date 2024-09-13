"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function CategoryPage({ params }) {
  const { category } = params;
  const { data: session } = useSession(); // Get session data
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch(`/api/books?category=${category.toLowerCase()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
      } else {
        setBooks([]); // Set an empty array if no data is returned
      }
      setLoading(false); // Stop loading when the data is fetched
    }

    fetchBooks();
  }, [category]);

  return (
    <div className="relative min-h-screen p-8 bg-gray-100 overflow-hidden">
      <Head>
        <title>{`${category.charAt(0).toUpperCase() + category.slice(1)} Books`}</title>
      </Head>

      {/* Background with overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/back.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm font-semibold text-gray-300">
          <Link href="/categories" className="text-gray-100 hover:text-white uppercase">
            Categories
          </Link>
          <span className="mx-2 text-white"> &gt; </span>
          <span className="text-white uppercase">{category}</span>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-white">
          {category.charAt(0).toUpperCase() + category.slice(1)} Books
        </h1>

        {/* Books grid */}
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="relative z-10 block bg-white p-4 rounded-lg border border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-200"
              >
                <Link href={`/categories/${category}/${book._id}`}>
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-auto object-contain rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                </Link>
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center col-span-full">
            No books available in the {category} category.
          </p>
        )}
      </div>
    </div>
  );
}
