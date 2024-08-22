"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

export default function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;
    const { data: session } = useSession(); // Get session data

    // Mock data for demonstration
    const allBooks = {
        fiction: [
            { id: '1', title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "/great.jpg" },
            { id: '2', title: "To Kill a Mockingbird", author: "Harper Lee", cover: "/covers/to-kill-a-mockingbird.jpg" },
            { id: '3', title: "1984", author: "George Orwell", cover: "/covers/1984.jpg" },
        ],
        "non-fiction": [
            { id: '4', title: "Sapiens", author: "Yuval Noah Harari", cover: "/covers/sapiens.jpg" },
            { id: '5', title: "Educated", author: "Tara Westover", cover: "/covers/educated.jpg" },
            { id: '6', title: "Becoming", author: "Michelle Obama", cover: "/covers/becoming.jpg" },
        ],
        science: [
            { id: '7', title: "A Brief History of Time", author: "Stephen Hawking", cover: "/covers/brief-history-of-time.jpg" },
            { id: '8', title: "The Selfish Gene", author: "Richard Dawkins", cover: "/covers/selfish-gene.jpg" },
            { id: '9', title: "The Origin of Species", author: "Charles Darwin", cover: "/covers/origin-of-species.jpg" },
        ],
        history: [
            { id: '10', title: "Guns, Germs, and Steel", author: "Jared Diamond", cover: "/covers/guns-germs-steel.jpg" },
            { id: '11', title: "The Diary of a Young Girl", author: "Anne Frank", cover: "/covers/anne-frank.jpg" },
            { id: '12', title: "1776", author: "David McCullough", cover: "/covers/1776.jpg" },
        ],
        biography: [
            { id: '13', title: "Steve Jobs", author: "Walter Isaacson", cover: "/covers/steve-jobs.jpg" },
            { id: '14', title: "The Wright Brothers", author: "David McCullough", cover: "/covers/wright-brothers.jpg" },
            { id: '15', title: "Long Walk to Freedom", author: "Nelson Mandela", cover: "/covers/long-walk-freedom.jpg" },
        ],
        fantasy: [
            { id: '16', title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", cover: "/covers/harry-potter.jpg" },
            { id: '17', title: "The Hobbit", author: "J.R.R. Tolkien", cover: "/covers/hobbit.jpg" },
            { id: '18', title: "A Game of Thrones", author: "George R.R. Martin", cover: "/covers/game-of-thrones.jpg" },
        ],
    };

    // Get books for the current category
    const books = allBooks[category.toLowerCase()] || [];

    return (
        <div className="relative min-h-screen p-6 bg-gray-100 overflow-hidden">
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

            <div className="relative z-10">
                <div className="mb-4 text-sm font-semibold text-gray-300">
                    <Link href="/categories" className="text-gray-100 hover:text-white uppercase">Categories</Link>
                    <span className="mx-2 text-white"> &gt; </span>
                    <span className="text-white uppercase">{category}</span>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-white">{category} Books</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="relative z-10 block bg-white p-4 rounded-lg border border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-200">
                            <Link href={`/categories/${category}/${book.id}`}>
                                <img 
                                    src={book.cover} 
                                    alt={book.title} 
                                    className="w-full h-auto object-contain rounded-lg mb-4" 
                                />
                                <h2 className="text-lg font-semibold">{book.title}</h2>
                                <p className="text-gray-600">{book.author}</p>
                            </Link>
                            {session && ( // Only show buttons if the user is logged in
                                <div className="flex justify-between mt-4">
                                    <button className="text-black-500 hover:text-red-700 transition duration-200">
                                        <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                                    </button>
                                    <button className="text-black-500 hover:text-blue-700 transition duration-200">
                                        <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
