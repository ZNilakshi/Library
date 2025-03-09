"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Image from 'next/image'; 

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImageUrl: string;
  backgroundImageUrl?: string;
  pdfUrl: string;
}

interface Params {
  category: string;
  bookId: string;
}

export default function BookPage({ params }: { params: Params }) {
  const { category, bookId } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);  // Track if the book is favorited
  const [loading, setLoading] = useState(true); // Track loading state
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await axios.get(`/api/books/${bookId}`);
        setBook(data.book);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch book details:', (error as Error).message);
      }
    };

    const checkIfFavorite = async () => {
      if (session) {
        try {
          const { data } = await axios.get(`/api/user/favorite?email=${session.user.email}`);
          const favoriteBooks = data.favorites.map((fav: { _id: string }) => fav._id); // Ensure type safety
          setIsFavorite(favoriteBooks.includes(bookId)); // Check if current book is in favorites
        } catch (error) {
          console.error('Failed to check favorites:', (error as Error).message);
        }
      }
    };

    fetchBookDetails();
    checkIfFavorite();
  }, [bookId, session]);

  const handleDownload = async () => {
    try {
      if (session && book) {
        await axios.post('/api/user/download', {
          email: session.user.email,
          bookId: bookId,
          bookTitle: book.title,
        });

        // Trigger the download
        const link = document.createElement('a');
        link.href = book.pdfUrl;
        link.setAttribute('download', book.title);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert('You need to be logged in to download the book.');
      }
    } catch (error) {
      console.error('Failed to update user downloads:', (error as Error).message);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (session) {
        const response = await axios.post('/api/user/favorite', {
          email: session.user.email,
          bookId: bookId,
        });

        if (response.status === 200) {
          setIsFavorite(true);
          alert('Book added to favorites successfully!');
        }
      } else {
        alert('You need to be logged in to add a book to favorites.');
      }
    } catch (error) {
      console.error('Failed to add book to favorites:', error);
      alert('Failed to add book to favorites.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Failed to load book details.</p>;
  }

  return (
    <div className="relative min-h-screen p-6 bg-gray-50 overflow-hidden">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${book.backgroundImageUrl || '/back.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backdropFilter: 'blur(10px)',
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

      <div className="relative z-10   min-h-screen">
       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
          <Image
  src={book.coverImageUrl}
  alt={book.title}
  width={400}    // Increased width
  height={600}   // Increased height
  className="w-full md:w-full lg:w-full xl:w-full h-auto object-contain rounded-lg"
  priority
/>

          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-6">{book.title}</h1>
              <p className="text-lg text-gray-700 mb-6">{book.description}</p>
              <p className="text-sm text-gray-600 mb-4">
                Author: <span className="font-medium text-gray-900">{book.author}</span>
              </p>
              <p className="text-sm text-gray-600">
                Category: <span className="font-medium text-gray-900">{category}</span>
              </p>
            </div>

            {session && (
              <div className="flex space-x-6 mt-6">
                <button
                  onClick={handleAddToFavorites}
                  className={`flex items-center justify-center w-12 h-12
                  rounded-full shadow-md transition duration-200 ${
                    isFavorite ? 'bg-green-500' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
