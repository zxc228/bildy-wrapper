import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (url) => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          Welcome to Bildy Wrapper
        </h1>
        <p className="text-lg mb-6 text-gray-300">Choose an option to proceed:</p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleClick('/onboarding/register')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Register
          </button>
          <button
            onClick={() => handleClick('/onboarding/login')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
