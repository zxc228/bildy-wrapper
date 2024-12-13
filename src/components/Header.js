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
      router.push('/clients'); // Если авторизован, перенаправляем на клиентов
    } else {
      router.push('/'); // Если не авторизован, перенаправляем на главную
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Обработка клика для "Bildy Wrapper" */}
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-gray-300"
          onClick={handleLogoClick}
        >
          Bildy Wrapper
        </h1>
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/clients" className="hover:underline">
                Clients
              </Link>
              <Link href="/projects" className="hover:underline">
                Projects
              </Link>
              <Link href="/delivery-notes" className="hover:underline">
                Delivery Notes
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/onboarding/register" className="hover:underline">
                Register
              </Link>
              <Link href="/onboarding/login" className="hover:underline">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
