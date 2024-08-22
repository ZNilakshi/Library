"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function BookPage({ params }: { params: { category: string, bookId: string } }) {
  const { category, bookId } = params;
  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const { data: session } = useSession(); // Get session data

  useEffect(() => {
    const books = [
      { id: '1', title: "The Great Gatsby", description: "A novel written by American author F. Scott Fitzgerald.", introduction: "The Great Gatsby is a classic of 20th-century literature. It is often seen as a critique of the American Dream, depicting the lives of the wealthy in the Jazz Age.", author: "F. Scott Fitzgerald", cover: "/great.jpg" },
      { id: '2', title: "To Kill a Mockingbird", description: "A novel by Harper Lee published in 1960.", introduction: "To Kill a Mockingbird is widely regarded as a masterpiece of American literature, dealing with serious issues like racial inequality and moral growth.", author: "Harper Lee", cover: "/covers/to-kill-a-mockingbird.jpg" },
      { id: '3', title: "1984", description: "A dystopian social science fiction novel and cautionary tale by George Orwell.", introduction: "1984 is a dystopian novel that explores the dangers of totalitarianism and extreme political ideology, presenting a grim portrayal of a future world.", author: "George Orwell", cover: "/covers/1984.jpg" },
      { id: '4', title: "Pride and Prejudice", description: "A romantic novel of manners written by Jane Austen.", introduction: "Pride and Prejudice is a beloved romance novel that also serves as a witty critique of social class and marriage in 19th-century England.", author: "Jane Austen", cover: "/covers/pride-and-prejudice.jpg" },
      { id: '5', title: "Moby Dick", description: "A novel by Herman Melville about the voyage of the whaling ship Pequod.", introduction: "Moby Dick is a complex and symbolic novel, often considered one of the greatest works of American literature, exploring themes of obsession and revenge.", author: "Herman Melville", cover: "/covers/moby-dick.jpg" },
      { id: '6', title: "War and Peace", description: "A novel by Leo Tolstoy, first published from 1865 to 1869.", introduction: "War and Peace is an epic novel that intertwines the lives of several characters against the backdrop of the Napoleonic Wars, offering profound insights into human nature.", author: "Leo Tolstoy", cover: "/covers/war-and-peace.jpg" },
    ];

    const selectedBook = books.find((b) => b.id === bookId);
    setBook(selectedBook);
  }, [bookId]);

  const handleCommentSubmit = () => {
    if (comment.trim() !== "") {
      setComments([...comments, comment]);
      setComment("");
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative min-h-screen p-6 bg-gray-50 overflow-hidden">
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

      <div className="relative z-10 px-8 py-12 bg-gray-50 min-h-screen">
        <div className="bg-gray-100 py-2 px-4 mb-8 rounded-lg shadow-md">
          <nav className="text-gray-600 text-sm font-semibold">
            <a href={`/categories/${category}`} className="hover:text-gray-800">BACK TO {category.toUpperCase()}</a>
          </nav>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <img src={book.cover} alt={book.title} className="w-2/3 lg:w-1/3 h-auto object-contain rounded-lg" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-6">{book.title}</h1>
              <p className="text-lg text-gray-700 mb-6">{book.description}</p>
              <p className="text-md text-gray-700 mb-6">{book.introduction}</p>
              <p className="text-sm text-gray-600 mb-4">Author: <span className="font-medium text-gray-900">{book.author}</span></p>
              <p className="text-sm text-gray-600">Category: <span className="font-medium text-gray-900">{category}</span></p>
            </div>
            {session && (
              <div className="flex space-x-6 mt-6">
                <button className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-200">
                  <FontAwesomeIcon icon={faHeart} className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-200">
                  <FontAwesomeIcon icon={faDownload} className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h2>
          {session ? (
            <div className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={handleCommentSubmit}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              >
                Submit Comment
              </button>
            </div>
          ) : (
            <p className="text-gray-600">Please log in to leave a comment.</p>
          )}
          <div>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                  <p className="text-gray-800">{comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No comments yet. Start the conversation!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
