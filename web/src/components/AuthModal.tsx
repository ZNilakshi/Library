import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const GoogleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24" // Adjusted to fit better in a button
    height="24" // Adjusted to fit better in a button
    viewBox="0 0 48 48"
    className="w-6 h-6 mr-2"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12
      c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20
      c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
      l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);


const AuthModal = ({ closeModal }) => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password?.value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!showForgotPassword && (!password || password.length < 8)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      let res, data;

      if (showForgotPassword) {
        res = await fetch('/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (res.ok && res.headers.get('Content-Type')?.includes('application/json')) {
          data = await res.json();
          setError("");
          setSuccessMessage("Password reset link sent. Please check your email.");
        } else {
          const errorMessage = await res.text();
          setError(errorMessage || "An error occurred while sending reset link");
          setSuccessMessage("");
        }
      } else if (isLogin) {
        res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          setError("");
          closeModal();
          router.push('/');
        }
      } else {
        res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok && res.headers.get('Content-Type')?.includes('application/json')) {
          data = await res.json();
          setError("");
          setSuccessMessage("Successfully registered. Redirecting to home...");
          setTimeout(async () => {
            const signInRes = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });
            if (!signInRes?.error) {
              closeModal();
              router.push('/');
            } else {
              setError("Error logging in after registration");
              setSuccessMessage("");
            }
          }, 2000);
        } else {
          const errorMessage = await res.text();
          setError(errorMessage || "An error occurred during registration");
          setSuccessMessage("");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      setSuccessMessage("");
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccessMessage("");
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setError("");
    setSuccessMessage("");
  };

  const handleBackToLoginClick = () => {
    setShowForgotPassword(false);
    setError("");
    setSuccessMessage("");
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-2xl w-full md:w-3/5 lg:w-2/5 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <button
              className={`flex-1 py-2 text-center font-bold rounded-lg ${
                isLogin && !showForgotPassword ? 'bg-custom-blue text-white' : 'bg-indigo-100 text-custom-blue'
              }`}
              onClick={() => setIsLogin(true)}
              disabled={showForgotPassword}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center font-bold rounded-lg ml-4 ${
                !isLogin && !showForgotPassword ? 'bg-custom-blue text-white' : 'bg-indigo-100 text-custom-blue'
              }`}
              onClick={() => setIsLogin(false)}
              disabled={showForgotPassword}
            >
              Register
            </button>
            <button className="text-gray-600 hover:text-gray-800" onClick={closeModal}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">{isLogin ? "Welcome Back!" : "Create Your Account"}</h2>
            <p className="text-gray-500">{isLogin ? "Sign in to continue" : "Join us and enjoy our service"}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-custom-blue"
                placeholder="Enter your email"
                required
              />
            </div>
            {!showForgotPassword && (
              <div>
                <label className="block text-gray-600" htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-custom-blue"
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-custom-blue text-white rounded-lg shadow-lg hover:bg-custom-blue transition duration-300"
            >
              {showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Register'}
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
          </form>
          {isLogin && !showForgotPassword && (
            <>
              <button
                className="w-full flex items-center justify-center py-2 mt-6 bg-white text-custom-blue rounded-lg shadow-lg hover:bg-custom-blue hover:text-white transition duration-300"
                onClick={() => signIn("google")}
              >
                {GoogleIcon} Sign In with Google
              </button>
              <button
                className="w-full text-custom-blue mt-4 hover:underline"
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </button>
            </>
          )}
          {showForgotPassword && (
            <button
              className="w-full text-custom-blue mt-4 hover:underline"
              onClick={handleBackToLoginClick}
            >
              Back to Login
            </button>
          )}
          
        </div>
      </div>
    )
  );
};

export default AuthModal;
