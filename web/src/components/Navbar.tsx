"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-auto" src="/your-logo.png" alt="Your Logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <div className="relative group">
                  <Link href="/" legacyBehavior>
                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                      Products <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                  <div className="hidden group-hover:block absolute z-10 bg-white text-black shadow-lg rounded-md mt-1 grid grid-cols-3 gap-4 p-4">
                    <div>
                      <h3 className="font-bold">Create a Website</h3>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Website Overview</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Website Templates</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Design Intelligence</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">For Portfolios</a>
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-bold">Sell Anything</h3>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Ecommerce Overview</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Templates for Sellers</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Sell Products</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Sell Services</a>
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-bold">Build Your Brand</h3>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Marketing Overview</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Email Marketing</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">SEO Tools</a>
                      </Link>
                      <Link href="/" legacyBehavior>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100">Creator Tools</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <Link href="/" legacyBehavior>
                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                      Templates <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                  <div className="hidden group-hover:block absolute z-10 bg-white text-black shadow-lg rounded-md mt-1">
                    <Link href="/" legacyBehavior>
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">Template 1</a>
                    </Link>
                    <Link href="/" legacyBehavior>
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">Template 2</a>
                    </Link>
                  </div>
                </div>
                <div className="relative group">
                  <Link href="/" legacyBehavior>
                    <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                      Resources <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                  <div className="hidden group-hover:block absolute z-10 bg-white text-black shadow-lg rounded-md mt-1">
                    <Link href="/" legacyBehavior>
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">Resource 1</a>
                    </Link>
                    <Link href="/" legacyBehavior>
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">Resource 2</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link href="/login" legacyBehavior>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log In</a>
              </Link>
              <Link href="/register" legacyBehavior>
                <a className="bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium ml-4">Get Started</a>
              </Link>
            </div>
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
            <Link href="/" legacyBehavior>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</a>
            </Link>
            <div className="relative group">
              <Link href="/" legacyBehavior>
                <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium inline-flex items-center">
                  Templates <ChevronDownIcon className="ml-1 h-4 w-4" />
                </a>
              </Link>
              <div className="bg-gray-700 text-white shadow-lg rounded-md mt-1">
                <Link href="/" legacyBehavior>
                  <a className="block px-4 py-2 text-sm hover:bg-gray-600">Template 1</a>
                </Link>
                <Link href="/" legacyBehavior>
                  <a className="block px-4 py-2 text-sm hover:bg-gray-600">Template 2</a>
                </Link>
              </div>
            </div>
            <Link href="/" legacyBehavior>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Resources</a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</a>
            </Link>
            <Link href="/register" legacyBehavior>
              <a className="bg-white text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Get Started</a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
