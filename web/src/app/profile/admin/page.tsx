"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function AdminProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country: '',
    profilePhoto: null as any,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // States for Books Management
  const [books, setBooks] = useState<any[]>([]);
  const [editBookId, setEditBookId] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Fiction',
    coverImage: null,
    pdf: null,
  });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');
  const [fetchBooksLoading, setFetchBooksLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch admin details and related data
      const fetchAdminProfile = async () => {
        try {
          // Fetch profile data
          const profileResponse = await axios.get('/api/updateProfile', {
            params: { email: session.user.email },
          });
          setProfileData(profileResponse.data.user);

          // Fetch books
          const booksResponse = await axios.get('/api/books', {
            params: { adminEmail: session.user.email },
          });
          setBooks(booksResponse.data.books);
        } catch (error) {
          console.error('Error fetching admin data:', error);
          setError('Failed to load admin data. Please try again.');
        } finally {
          setFetchBooksLoading(false);
        }
      };
      fetchAdminProfile();
    }
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        setProfileData({ ...profileData, profilePhoto: files[0] });
      }
    };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('country', profileData.country);

    if (profileData.profilePhoto instanceof File) {
      formData.append('profilePhoto', profileData.profilePhoto);
    }

    try {
      const response = await axios.put('/api/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData({
        ...profileData,
        profilePhoto: response.data.user.profilePhoto,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Books Management
  const handleBookChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (name === 'coverImage' || name === 'pdf') {
      if (files) {
        setNewBook({ ...newBook, [name]: files[0] });
      }
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleAddBook = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError('');
    setBookSuccess('');
  
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('description', newBook.description);
    formData.append('category', newBook.category);
    if (newBook.coverImage) {
      formData.append('coverImage', newBook.coverImage);
    }
    if (newBook.pdf) {
      formData.append('pdf', newBook.pdf);
    }
    formData.append('adminEmail', session.user.email);
  
    try {
      const response = await axios.post('/api/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setBooks([response.data.book, ...books]);
      setNewBook({
        title: '',
        author: '',
        description: '',
        category: 'Fiction',
        coverImage: null,
        pdf: null,
      });
      setBookSuccess('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
      setBookError('Failed to add book. Please try again.');
    } finally {
      setBookLoading(false);
      setTimeout(() => setBookSuccess(''), 3000);
    }
  };

  const handleEditBook = (bookId: SetStateAction<null>) => {
    const bookToEdit = books.find((book) => book._id === bookId);
    setNewBook({
      title: bookToEdit.title,
      author: bookToEdit.author,
      description: bookToEdit.description,
      category: bookToEdit.category,
      coverImage: null,
      pdf: null,
    });
    setEditBookId(bookId);
  };

  const handleUpdateBook = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setBookLoading(true);
    setBookError('');
    setBookSuccess('');
  
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('description', newBook.description);
    formData.append('category', newBook.category);
  
    if (newBook.coverImage) {
      formData.append('coverImage', newBook.coverImage);
    }
    if (newBook.pdf) {
      formData.append('pdf', newBook.pdf);
    }
  
    try {
      const response = await axios.put(`/api/books/${editBookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedBooks = books.map((book) =>
        book._id === editBookId ? response.data.book : book
      );
      setBooks(updatedBooks);
      setEditBookId(null);
      setNewBook({
        title: '',
        author: '',
        description: '',
        category: 'Fiction',
        coverImage: null,
        pdf: null,
      });
      setBookSuccess('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      setBookError('Failed to update book. Please try again.');
    } finally {
      setBookLoading(false);
      setTimeout(() => setBookSuccess(''), 3000);
    }
  };

  const handleDeleteBook = async (bookId: any) => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      setBookError('Failed to delete book. Please try again.');
    }
  };
  

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return (
          <div className="text-center bg-white p-6 rounded-lg shadow-lg  max-w-md mx-auto">
            <Image
              src={
                profileData.profilePhoto instanceof File
                  ? URL.createObjectURL(profileData.profilePhoto)
                  : profileData.profilePhoto || '/user.png'
              }
              alt="Profile"
              width={96}
              height={96}
              className="h-24 w-24  rounded-full mx-auto border-4 border-gray-200 mb-4"
            />
            {isEditing ? (
              <div className="mt-4">
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                />
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                />
                {loading ? (
                  <p>Saving...</p>
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4"
                  >
                    Save
                  </button>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-lg font-semibold">{profileData.name}</p>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-gray-600">{profileData.country}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        );
      case 'books':
        return (
          <div>
         <div className="flex justify-center items-center min-h-screen">
  <div className="mt-3 w-full bg-white p-6 shadow-lg mx-auto max-w-lg ">

    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Add a New Book</h2>
  
  <form onSubmit={handleAddBook} className="space-y-4">
    {/* Book Title */}
    <div>
      <label className="block text-gray-600 font-medium">Book Title</label>
      <input
        type="text"
        name="title"
        value={newBook.title}
        onChange={handleBookChange}
        placeholder="Enter book title"
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 focus:ring "
        required
      />
    </div>

    {/* Author */}
    <div>
      <label className="block text-gray-600 font-medium">Author</label>
      <input
        type="text"
        name="author"
        value={newBook.author}
        onChange={handleBookChange}
        placeholder="Enter author name"
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 focus:ring "
        required
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-gray-600 font-medium">Description</label>
      <textarea
        name="description"
        value={newBook.description}
        onChange={handleBookChange}
        placeholder="Write a short description"
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 focus:ring "
        required
      />
    </div>

    {/* Category */}
    <div>
      <label className="block text-gray-600 font-medium">Category</label>
      <select
        name="category"
        value={newBook.category}
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 focus:ring "
        required
      >
        <option value="" disabled>Select category</option>
        <option value="fiction">Fiction</option>
        <option value="non-fiction">Non-fiction</option>
        <option value="science">Science</option>
        <option value="history">History</option>
        <option value="biography">Biography</option>
        <option value="fantasy">Fantasy</option>
        <option value="mystery">Mystery</option>
        <option value="romance">Romance</option>
        <option value="horror">Horror</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Cover Image Upload */}
    <div>
      <label className="block text-gray-600 font-medium">Cover Image</label>
      <input
        type="file"
        name="coverImage"
        accept="image/*"
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 cursor-pointer focus:ring "
      />
    </div>

    {/* PDF Upload */}
    <div>
      <label className="block text-gray-600 font-medium">Upload PDF</label>
      <input
        type="file"
        name="pdf"
        accept="application/pdf"
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-0 cursor-pointer focus:ring "
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-dark-green text-white font-semibold py-2 rounded-lg mt-4 hover:bg-green-700 transition duration-200"
      disabled={bookLoading}
    >
      {bookLoading ? 'Adding...' : 'Add Book'}
    </button>

    {/* Error & Success Messages */}
    {bookError && <p className="text-red-500 mt-2 text-center">{bookError}</p>}
    {bookSuccess && <p className="text-green-500 mt-2 text-center">{bookSuccess}</p>}
  </form>
</div>

  </div>
</div>

            <h2 className="text-xl font-semibold mb-4">Books</h2>
            {bookError && <p className="text-red-500 mb-4">{bookError}</p>}
            {bookSuccess && <p className="text-green-500 mb-4">{bookSuccess}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white p-4 border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {editBookId === book._id ? (
                    <form onSubmit={handleUpdateBook}>
                    <label className="font-semibold">Book Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newBook.title}
                      onChange={handleBookChange}
                      placeholder="Book Title"
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                      required
                    />
                  
                    <label className="font-semibold">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={newBook.author}
                      onChange={handleBookChange}
                      placeholder="Author"
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                      required
                    />
                  
                    <label className="font-semibold">Description</label>
                    <textarea
                      name="description"
                      value={newBook.description}
                      onChange={handleBookChange}
                      placeholder="Description"
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                      required
                    />
                  
                    <label className="font-semibold">Category</label>
                    <select
                      name="category"
                      value={newBook.category}
                      onChange={handleBookChange}
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                      required
                    >
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-fiction</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="biography">Biography</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="mystery">Mystery</option>
                      <option value="romance">Romance</option>
                      <option value="horror">Horror</option>
                      <option value="other">Other</option>
                    </select>
                  
                    <label className="font-semibold">Cover Image</label>
                    <input
                      type="file"
                      name="coverImage"
                      accept="image/*"
                      onChange={handleBookChange}
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                    />
                  
                    <label className="font-semibold">Upload PDF</label>
                    <input
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handleBookChange}
                      className="border border-gray-300 rounded-lg p-2 w-full mt-0"
                    />
                  
                    <button
                      type="submit"
                      className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4"
                      disabled={bookLoading}
                    >
                      {bookLoading ? 'Saving...' : 'Save'}
                    </button>
                  </form>
                  
                  ) : (
                    <>
                      <Image
                        src={book.coverImageUrl}
                        alt="Cover"
                        width={192}
                        height={192}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{book.title}</h4>
                        <p className="text-gray-600 mb-1"><strong>Author:</strong> {book.author}</p>
                        <p className="text-gray-500 text-sm mb-2"><strong>Category:</strong> {book.category}</p>
                        
                        {book.pdfUrl && (
                          <div className="mt-2">
                            <a
                              href={book.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-dark-green underline"
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between p-4">
                        <button
                          onClick={() => handleEditBook(book._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
           
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8"
    style={{
      backgroundImage: `url('/back.jpg')`, // Update this with your actual image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>
      <div className="text-center mb-6 ">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className=" p-6 rounded-lg shadow-lg">
        <div className=" flex justify-center mb-4">
          <button
            onClick={() => setSelectedTab('profile')}
            className={`px-4 py-2 rounded-lg mr-2 ${selectedTab === 'profile' ? 'bg-dark-green text-white' : 'bg-gray-200'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setSelectedTab('books')}
            className={`px-4 py-2 rounded-lg ${selectedTab === 'books' ? 'bg-dark-green text-white' : 'bg-gray-200'}`}
          >
            Books
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}