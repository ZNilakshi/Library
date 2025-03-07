"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    signOut().then(() => router.push('/'));
  };

  const handleProfileClick = () => {
    if (session?.user.role === 'admin') {
      router.push('/profile/admin');
    } else {
      router.push('/profile/user');
    }
  };

  return (
    <nav className="bg-dark-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image src="/logo.png" alt="Your Logo" width={36} height={36} />
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/categories" legacyBehavior>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  CATEGORIES
                </a>
              </Link>
              <Link href="/about-us" legacyBehavior>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  ABOUT US
                </a>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 hidden md:flex justify-center items-center">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full text-black focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 py-2 bg-gray-700 text-white rounded-r-full hover:bg-gray-600 focus:outline-none"
              >
                Search
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-2">
                <Image
                  src={session?.user?.image ?? '/user.png'}
                  alt="User Photo"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" legacyBehavior>
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Log In
                  </a>
                </Link>
                <Link href="/register" legacyBehavior>
                  <a className="bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">
                    Get Started
                  </a>
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/categories" legacyBehavior>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Categories
              </a>
            </Link>
            <Link href="/about-us" legacyBehavior>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                About Us
              </a>
            </Link>

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="mt-3 px-2">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full text-black focus:outline-none"
              />
              <button
                type="submit"
                className="w-full mt-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
              >
                Search
              </button>
            </form>

            {session ? (
              <>
                <div
                  className="flex items-center space-x-2 mt-3 cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <Image
                    src={session?.user?.image ?? '/user.png'}
                    alt="User Photo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" legacyBehavior>
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Log In
                  </a>
                </Link>
                <Link href="/register" legacyBehavior>
                  <a className="bg-white text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">
                    Get Started
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
