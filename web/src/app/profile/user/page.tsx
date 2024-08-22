"use client";
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: session?.user.name || '',
    email: session?.user.email || '',
    country: session?.user.country || '',
    favoriteBook: session?.user.favoriteBook || '',
    profilePhoto: session?.user.profilePhoto || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <div className="text-center">
            <img
              src={profileData.profilePhoto || '/default-avatar.png'}
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
        );
      case 'favorites':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Favorites</h3>
            <p>Favorite Item 1</p>
            <p>Favorite Item 2</p>
          </div>
        );
      case 'downloads':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Downloads</h3>
            <p>Downloaded Item 1</p>
            <p>Downloaded Item 2</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-dark-green text-white p-6 rounded-l-lg">
        <div className="text-center mb-6">
          <img
            src={profileData.profilePhoto || '/default-avatar.png'}
            alt="Profile"
            className="h-24 w-24 rounded-full mx-auto border-4 border-gray-200"
          />
          <h2 className="mt-4 font-semibold">User Profile</h2>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => setSelectedTab('profile')}
            className={`w-full text-left py-2 px-4 rounded ${selectedTab === 'profile' ? 'bg-gray-700' : 'bg-dark-green'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setSelectedTab('favorites')}
            className={`w-full text-left py-2 px-4 rounded ${selectedTab === 'favorites' ? 'bg-gray-700' : 'bg-dark-green'}`}
          >
            Favorites
          </button>
          <button
            onClick={() => setSelectedTab('downloads')}
            className={`w-full text-left py-2 px-4 rounded ${selectedTab === 'downloads' ? 'bg-gray-700' : 'bg-dark-green'}`}
          >
            Downloads
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10 relative">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg shadow-lg z-0"
          style={{
            backgroundImage: 'url(/back.jpg)', // Replace with your background image path
            opacity: 0.3,
          }}
        />
        <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
