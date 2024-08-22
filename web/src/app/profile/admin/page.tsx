"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: session?.user.name || '',
    email: session?.user.email || '',
    role: session?.user.role || 'Admin',
    permissions: session?.user.permissions || [],
    profilePhoto: session?.user.profilePhoto || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    name: '',
    title: '',
    description: '',
    category: '',
    author: '',
    coverPhoto: '',
    pdf: null,
  });

  useEffect(() => {
    if (selectedTab === 'manageBooks') {
      fetchBooks();
    }
  }, [selectedTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleBookPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setNewBook({ ...newBook, coverPhoto: photoURL });
    }
  };

  const handleBookPDFChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBook({ ...newBook, pdf: file });
    }
  };

  const handleAddBook = async () => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    Object.keys(newBook).forEach((key) => {
      if (key === 'pdf' && newBook[key]) {
        formData.append(key, newBook[key]);
      } else if (key !== 'pdf') {
        formData.append(key, newBook[key]);
      }
    });

    try {
      const response = await axios.post('/api/addBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Book added successfully:', response.data);
      setNewBook({ name: '', title: '', description: '', category: '', author: '', coverPhoto: '', pdf: null });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/getBooks');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      try {
        setLoading(true);
        const response = await axios.put('/api/updateProfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setProfileData({ ...profileData, profilePhoto: response.data.user.profilePhoto });
      } catch (error) {
        console.error('Error uploading photo:', error);
        setError('Failed to upload photo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.put('/api/updateProfile', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Admin Profile</h3>
            <img
              src={adminData.profilePhoto}
              alt="Profile"
              className="h-24 w-24 rounded-full mb-4 border-4 border-gray-200"
            />
            {isEditing ? (
              <div className="flex flex-col items-center space-y-4">
                <h4 className="text-lg font-semibold mb-2">Edit Profile</h4>
                <input
                  type="text"
                  name="name"
                  value={adminData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="border rounded p-2 w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={adminData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border rounded p-2 w-full"
                />
                <input
                  type="text"
                  name="role"
                  value={adminData.role}
                  onChange={handleInputChange}
                  placeholder="Role"
                  className="border rounded p-2 w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border rounded p-2 w-full"
                />
                {loading ? (
                  <p>Saving...</p>
                ) : (
                  <button onClick={handleSave} className="bg-dark-green text-white px-4 py-2 rounded">
                    Save
                  </button>
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            ) : (
              <div className="text-center">
                <p>Name: {adminData.name}</p>
                <p>Email: {adminData.email}</p>
                <p>Role: {adminData.role}</p>
                <button onClick={() => setIsEditing(true)} className="bg-dark-green text-white px-4 py-2 rounded mt-4">
                  Edit
                </button>
              </div>
            )}
          </div>
        );
      case 'manageUsers':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
            <p>Manage the user accounts here.</p>
            {/* Implement user management functionalities here */}
          </div>
        );
      case 'siteSettings':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Site Settings</h3>
            <p>Configure site settings here.</p>
            {/* Implement site settings functionalities here */}
          </div>
        );
      case 'manageBooks':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Manage Books</h3>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Add New Book</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Book Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newBook.name}
                    onChange={handleInputChange}
                    placeholder="Enter book name"
                    className="border rounded p-2 w-full mb-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    className="border rounded p-2 w-full mb-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newBook.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    className="border rounded p-2 w-full mb-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={newBook.category}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full mb-2"
                  >
                    <option value="">Select a category</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="biography">Biography</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    placeholder="Enter author"
                    className="border rounded p-2 w-full mb-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBookPhotoChange}
                    className="border rounded p-2 w-full mb-2"
                  />
                  {newBook.coverPhoto && <img src={newBook.coverPhoto} alt="Cover Preview" className="h-24 w-24 rounded mt-2" />}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleBookPDFChange}
                    className="border rounded p-2 w-full mb-2"
                  />
                </div>
                {loading ? (
                  <p>Adding...</p>
                ) : (
                  <button onClick={handleAddBook} className="bg-dark-green text-white px-4 py-2 rounded">
                    Add Book
                  </button>
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Book List</h4>
              <ul>
                {books.map((book) => (
                  <li key={book._id} className="mb-2">
                    <div className="flex flex-col items-start">
                      <h5 className="text-md font-bold">{book.title}</h5>
                      <p>{book.description}</p>
                      <p>Author: {book.author}</p>
                      <p>Category: {book.category}</p>
                      {book.coverPhoto && <img src={book.coverPhoto} alt={book.title} className="h-24 w-24 rounded mb-2" />}
                      {book.pdf && (
                        <a href={`/pdfs/${book.pdf}`} target="_blank" className="text-dark-green underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start p-8 bg-gray-100 text-gray-900 rounded-lg w-full max-w-4xl mx-auto">
      {/* Left Section */}
      <div className="md:w-1/2 w-full bg-dark-green text-white p-4 rounded-lg flex flex-col items-start space-y-4">
        <img
          src={adminData.profilePhoto}
          alt="Profile"
          className="h-24 w-24 rounded-full mb-4 border-4 border-white"
        />
        <button
          onClick={() => setSelectedTab('profile')}
          className={`w-full text-left px-4 py-2 rounded ${selectedTab === 'profile' ? 'bg-dark-green' : 'bg-gray-600'}`}
        >
          Profile
        </button>
        <button
          onClick={() => setSelectedTab('manageUsers')}
          className={`w-full text-left px-4 py-2 rounded ${selectedTab === 'manageUsers' ? 'bg-dark-green' : 'bg-gray-600'}`}
        >
          Manage Users
        </button>
        <button
          onClick={() => setSelectedTab('siteSettings')}
          className={`w-full text-left px-4 py-2 rounded ${selectedTab === 'siteSettings' ? 'bg-dark-green' : 'bg-gray-600'}`}
        >
          Site Settings
        </button>
        <button
          onClick={() => setSelectedTab('manageBooks')}
          className={`w-full text-left px-4 py-2 rounded ${selectedTab === 'manageBooks' ? 'bg-dark-green' : 'bg-gray-600'}`}
        >
        Manage Books
        </button>
      </div>
      {/* Right Section */}
      <div className="md:w-2/3 w-full bg-white p-6 rounded-lg shadow-lg mt-6 md:mt-0 md:ml-6">
        {renderContent()}
      </div>
    </div>
  );
}
