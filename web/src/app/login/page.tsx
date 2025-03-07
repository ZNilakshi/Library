"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: 'url(/back.jpg)' }}>
      <div className="flex max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 bg-dark-green p-8">
          <div className="relative w-full h-full">
            <Image
              className="absolute inset-0 w-full h-full object-cover"
              src="/back.jpg"
              alt="Your Logo"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex-1 px-4 py-6 sm:px-8 lg:px-12">
          <div className="max-w-md w-full space-y-8 mx-auto">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-center">{error}</div>}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">E-mail Address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Link href="/forgot-password" className="font-medium text-dark-green hover:text-dark-green">Forgot your password?</Link>
              </div>

              <button type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dark-green hover:bg-dark-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign In
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => signIn('google')}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  <i className="fab fa-google text-lg mr-2"></i> Sign in with Google
                </button>
              </div>

              <div className="text-center mt-4">
                <Link href="/register" className="font-medium text-gray-600 hover:text-gray-500">Create an account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
