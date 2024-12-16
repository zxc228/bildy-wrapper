import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../../services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('jwt', response.data.token);
      router.push('/clients'); // Open clients page after login
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="bg-gray-800 text-gray-300 p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-6">
            Login
          </h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div className="space-y-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transform transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
