
"use client";
import { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
      
        console.log('User registered successfully');
        // Optionally redirect to login page or show success message
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        // Handle errors (e.g., user already exists)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 bg-blue-500 p-8">
          <div className="text-white text-center">
            <img className="mx-auto h-16 w-auto" src="/your-logo.png" alt="Your Logo" />
            <h2 className="mt-6 text-4xl font-bold">Welcome to Spacer</h2>
            <p className="mt-4 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="mt-8 flex justify-between text-sm text-white">
            <Link href="/creator" legacyBehavior>
              <a className="hover:underline">Creator Here</a>
            </Link>
            <Link href="/designer" legacyBehavior>
              <a className="hover:underline">Designer Here</a>
            </Link>
          </div>
        </div>
        <div className="flex-1 px-4 py-6 sm:px-8 lg:px-12">
          <div className="max-w-md w-full space-y-8 mx-auto">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">E-mail Address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input id="terms-and-conditions" name="terms-and-conditions" type="checkbox" required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="terms-and-conditions" className="ml-2 block text-sm text-gray-900">
                    By Signing up, I agree with{' '}
                    <Link href="/terms" legacyBehavior>
                      <a className="font-medium text-blue-600 hover:text-blue-500">Terms & Conditions</a>
                    </Link>
                  </label>
                </div>
              </div>

              <div>
                <button type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign Up
                </button>
              </div>
              <div className="text-center mt-4">
                <Link href="/login" legacyBehavior>
                  <a className="font-medium text-gray-600 hover:text-gray-500">Sign in</a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;