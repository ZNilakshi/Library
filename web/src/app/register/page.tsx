"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize useRouter

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User registered successfully');

      // Fetch user session after registration
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();

      if (sessionData) {
        router.refresh(); // Force a re-render of the navbar
      }

      router.push('/login'); // Redirect to homepage
    } else {
      setError(data.error || 'Something went wrong. Please try again.');
    }
  } catch (error) {
    setError('Network error. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: 'url(/back.jpg)' }}>
      <div className="flex max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 bg-dark-green p-8">
         
          <div className="relative w-full h-full">
          <Image className="absolute inset-0 w-full h-full object-cover" src="/back.jpg" alt="Your Logo" layout="fill" />  </div>
        
        </div>
        <div className="flex-1 px-4 py-6 sm:px-8 lg:px-12">
          <div className="max-w-md w-full space-y-8 mx-auto">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
         
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
                    className="h-4 w-4 text-dark-green focus:dark-green border-gray-300 rounded" />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    By signing up, I agree to the <Link href="/terms" className="text-dark-green hover:underline">Terms & Conditions</Link>
                  </label>
                </div>
              </div>

              <div>
                <button type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dark-green hover:bg-dark-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}>
                   {loading ? 'Signing Up...' : 'Sign Up'}
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
