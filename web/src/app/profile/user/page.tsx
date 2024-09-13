"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    country: '',
    favoriteBook: '',
    profilePhoto: '',
  });
  const [downloads, setDownloads] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile data
  useEffect(() => {
    if (session) {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('/api/updateProfile', {
            params: { email: session.user.email },
          });
          setProfileData(response.data.user);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile. Please try again.');
        }
      };
      fetchUserProfile();
    }
  }, [session]);

  // Fetch user's downloads
  useEffect(() => {
    if (selectedTab === 'downloads' && session) {
      const fetchDownloads = async () => {
        try {
          const response = await axios.get('/api/user/downloads', {
            params: { email: session.user.email },
          });
          setDownloads(response.data.downloads);
        } catch (error) {
          console.error('Error fetching downloads:', error);
          setError('Failed to load downloads. Please try again.');
        }
      };
      fetchDownloads();
    }
  }, [selectedTab, session]);

  // Fetch user's favorite books
  useEffect(() => {
    if (selectedTab === 'favorites' && session) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`/api/user/favorite?email=${session.user.email}`);
          console.log("Favorites Data:", response.data.favorites); // Log the data to the console
          setFavorites(response.data.favorites);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setError('Failed to load favorites. Please try again.');
        }
      };
      fetchFavorites();
    }
  }, [selectedTab, session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prevData) => ({ ...prevData, profilePhoto: file }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('country', profileData.country);
    formData.append('favoriteBook', profileData.favoriteBook);

    if (profileData.profilePhoto instanceof File) {
      formData.append('profilePhoto', profileData.profilePhoto);
    }

    try {
      const response = await axios.put('/api/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData((prevData) => ({
        ...prevData,
        profilePhoto: response.data.user.profilePhoto,
      }));
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
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
              <img
                src={
                  profileData.profilePhoto instanceof File
                    ? URL.createObjectURL(profileData.profilePhoto)
                    : profileData.profilePhoto || '/default-avatar.png'
                }
                alt="Profile"
                className="h-24 w-24 rounded-full mx-auto border-4 border-gray-200 mb-4"
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
                    type="text"
                    name="favoriteBook"
                    value={profileData.favoriteBook}
                    onChange={handleInputChange}
                    placeholder="Favorite Book"
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
                    <button onClick={handleSave} className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4">
                      Save
                    </button>
                  )}
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-lg">Name: {profileData.name}</p>
                  <p className="font-semibold text-lg">Email: {profileData.email}</p>
                  <p className="font-semibold text-lg">Country: {profileData.country}</p>
                  <p className="font-semibold text-lg">Favorite Book: {profileData.favoriteBook}</p>
                  <button onClick={() => setIsEditing(true)} className="bg-dark-green text-white px-6 py-2 rounded-lg mt-4">
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4">Favorite Books</h3>
            {favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {favorites.map((favorite, index) => (
                  <div key={index} className="bg-white border rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={favorite.bookId?.coverImageUrl || '/default-cover.png'}
                      alt={favorite.bookId?.title || 'No title available'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between h-48">
                      <div>
                        <h4 className="text-lg font-bold mb-2">
                          {favorite.bookId?.title || 'Untitled'}
                        </h4>
                        <p className="text-gray-600 mb-1">
                          <strong>Author:</strong> {favorite.bookId?.author || 'Unknown'}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Category:</strong> {favorite.bookId?.category || 'Uncategorized'}
                        </p>
                      </div>
                      {favorite.bookId?.pdfUrl && (
                        <a
                          href={favorite.bookId.pdfUrl}
                          className="mt-2 inline-block bg-dark-green text-white text-center py-2 px-4 rounded-lg hover:bg-gray-500 text-dark-green transition-colors duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No favorite books yet.</p>
            )}
          </div>
        );

      case 'downloads':
        return (
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4">My Downloads</h3>
            {/* Downloads mapping logic */}
            {downloads && downloads.length > 0 ? (
              <ul>
                {downloads.map((download, index) => (
                  <li key={index}>{download.title}</li>
                ))}
              </ul>
            ) : (
              <p>No downloads yet.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{
        backgroundImage: `url('/back.jpg')`, // Update this with your actual image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
      <div className="flex justify-center space-x-4 mb-6">
  <button
    onClick={() => setSelectedTab('profile')}
    className={`px-6 py-2 rounded-lg ${
      selectedTab === 'profile' ? 'bg-gray-600 text-white' : 'bg-dark-green text-white'
    }`}
  >
    Profile
  </button>
  <button
    onClick={() => setSelectedTab('favorites')}
    className={`px-6 py-2 rounded-lg ${
      selectedTab === 'favorites' ? 'bg-gray-600 text-white' : 'bg-dark-green text-white'
    }`}
  >
    Favorites
  </button>
</div>

      <div>{renderContent()}</div>
    </div>
  );
}
