"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface ProfileData {
  name: string;
  email: string;
  country: string;
  favoriteBook: string;
  profilePhoto: string | File;
}

interface FavoriteBook {
  bookId: {
    coverImageUrl: string;
    title: string;
    author: string;
    category: string;
    pdfUrl: string;
  };
}

export default function UserProfile() {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState<'profile' | 'favorites' | 'downloads'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    country: '',
    favoriteBook: '',
    profilePhoto: '',
  });
  const [downloads, setDownloads] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prevData) => ({ ...prevData, profilePhoto: file }));
    }
  };

  const handleSave = async (e: SyntheticEvent) => {
    e.preventDefault();
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
            <Image
  src={
    profileData.profilePhoto instanceof File
      ? URL.createObjectURL(profileData.profilePhoto)
      : profileData.profilePhoto || '/default-avatar.png'
  }
  alt="Profile"
  width={100} 
  height={100} 
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {favorites.map((favorite, index) => (
                  <div key={index} className="bg-white border rounded-lg shadow-lg overflow-hidden">
                    <Image 
                      src={favorite.bookId?.coverImageUrl || '/default-cover.png'}
                      alt={favorite.bookId?.title || 'No title available'}
                      width={500}  
                      height={200}  
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
                     className="mt-2 inline-block bg-dark-green text-white text-center py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                     target="_blank"
                     rel="noopener noreferrer"
                   >
                     Download PDF
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
            {downloads && downloads.length > 0 ? (
              <ul>
                {downloads.map((download, index) => (
                  <li key={index}>{download}</li>
                ))}
              </ul>
            ) : (
              <p>No downloads available yet.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center mt-6">
        <div className="w-full lg:w-1/2">
          <div className="bg-dark-green text-white rounded-lg p-4 flex justify-around">
          <button
        onClick={() => setSelectedTab('profile')}
        className={`px-4 py-2 rounded-lg ${selectedTab === 'profile' ? 'bg-gray-400' : 'bg-transparent'}`}
      >
        Profile
      </button>
      <button
        onClick={() => setSelectedTab('favorites')}
        className={`px-4 py-2 rounded-lg ${selectedTab === 'favorites' ? 'bg-gray-400' : 'bg-transparent'}`}
      >
        Favorites
      </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
