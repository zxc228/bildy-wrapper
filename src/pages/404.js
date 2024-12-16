// FILE: pages/404.js
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-300">
      <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">
        404
      </h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <Link href="/" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
          Go Back Home
        
      </Link>
    </div>
  );
};

export default Custom404;