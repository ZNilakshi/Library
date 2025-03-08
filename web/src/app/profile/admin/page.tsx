"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country: '',
    profilePhoto: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // States for Books Management
  const [books, setBooks] = useState([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profilePhoto: file });
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
  const handleBookChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage' || name === 'pdf') {
      setNewBook({ ...newBook, [name]: files[0] });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleAddBook = async (e) => {
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

  const handleEditBook = (bookId) => {
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

  const handleUpdateBook = async (e) => {
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

  const handleDeleteBook = async (bookId) => {
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
          <div className="text-center bg-white p-6 rounded-lg shadow-lg shadow-lg max-w-md mx-auto">
            <img
              src={
                profileData.profilePhoto instanceof File
                  ? URL.createObjectURL(profileData.profilePhoto)
                  : profileData.profilePhoto || '/default-avatar.png'
              }
              alt="Profile"
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
  <div className="mt-3 w-full bg-white p-6 shadow-lg max-w-md mx-auto max-w-lg ">
    <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
    <form onSubmit={handleAddBook}>
      <input
        type="text"
        name="title"
        value={newBook.title}
        onChange={handleBookChange}
        placeholder="Book Title"
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
        required
      />
      <input
        type="text"
        name="author"
        value={newBook.author}
        onChange={handleBookChange}
        placeholder="Author"
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
        required
      />
      <textarea
        name="description"
        value={newBook.description}
        onChange={handleBookChange}
        placeholder="Description"
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
        required
      />
      <select
        name="category"
        value={newBook.category}
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
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
      <input
        type="file"
        name="coverImage"
        accept="image/*"
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
      />
      <input
        type="file"
        name="pdf"
        accept="application/pdf"
        onChange={handleBookChange}
        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
      />
      <button
        type="submit"
        className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4 w-full"
        disabled={bookLoading}
      >
        {bookLoading ? 'Adding...' : 'Add Book'}
      </button>
      {bookError && <p className="text-red-500 mt-2">{bookError}</p>}
      {bookSuccess && <p className="text-green-500 mt-2">{bookSuccess}</p>}
    </form>
  </div>
</div>

            <h2 className="text-xl font-semibold mb-4">Books</h2>
            {bookError && <p className="text-red-500 mb-4">{bookError}</p>}
            {bookSuccess && <p className="text-green-500 mb-4">{bookSuccess}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white  border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {editBookId === book._id ? (
                    <form onSubmit={handleUpdateBook}>
                      <input
                        type="text"
                        name="title"
                        value={newBook.title}
                        onChange={handleBookChange}
                        placeholder="Book Title"
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                        required
                      />
                      <input
                        type="text"
                        name="author"
                        value={newBook.author}
                        onChange={handleBookChange}
                        placeholder="Author"
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                        required
                      />
                      <textarea
                        name="description"
                        value={newBook.description}
                        onChange={handleBookChange}
                        placeholder="Description"
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                        required
                      />
                      <select
                        name="category"
                        value={newBook.category}
                        onChange={handleBookChange}
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
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
                      <input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleBookChange}
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                      />
                      <input
                        type="file"
                        name="pdf"
                        accept="application/pdf"
                        onChange={handleBookChange}
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2"
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
                      <img
                        src={book.coverImageUrl}
                        alt="Cover"
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