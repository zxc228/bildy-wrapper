import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      router.push('/clients');
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <h1
          className="text-3xl font-extrabold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 hover:scale-105 transition-transform duration-300"
          onClick={handleLogoClick}
        >
          Bildy Wrapper
        </h1>
        {/* Навигация */}
        <nav className="flex space-x-6 items-center">
          {isAuthenticated ? (
            <>
              <Link
                href="/clients"
                className="text-gray-300 hover:text-cyan-400 hover:scale-105 transition-transform duration-300 text-lg"
              >
                Clients
              </Link>
              <Link
                href="/projects"
                className="text-gray-300 hover:text-cyan-400 hover:scale-105 transition-transform duration-300 text-lg"
              >
                Projects
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/onboarding/register"
                className="text-gray-300 hover:text-cyan-400 hover:scale-105 transition-transform duration-300 text-lg"
              >
                Register
              </Link>
              <Link
                href="/onboarding/login"
                className="text-gray-300 hover:text-cyan-400 hover:scale-105 transition-transform duration-300 text-lg"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
