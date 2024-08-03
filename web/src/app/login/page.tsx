import Link from 'next/link';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import icons

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:w-1/2 bg-blue-500 p-8">
          <div className="text-white text-center">
            <img className="mx-auto h-16 w-auto" src="/your-logo.png" alt="Your Logo" />
            <h2 className="mt-6 text-4xl font-bold">Welcome Back</h2>
            <p className="mt-4 text-sm">
              Please enter your credentials to access your account.
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
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">E-mail Address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email" />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" legacyBehavior>
                    <a className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                  </Link>
                </div>
              </div>

              <div>
                <button type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign In
                </button>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaGoogle className="text-blue-600 mr-2" />
                 
                </button>
                <button
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaFacebook className="text-blue-600 mr-2" />
                  
                </button>
              </div>
              <div className="text-center mt-4">
                <Link href="/register" legacyBehavior>
                  <a className="font-medium text-gray-600 hover:text-gray-500">Create an account</a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
