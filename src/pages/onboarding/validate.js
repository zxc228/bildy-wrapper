import { useState } from 'react';
import { useRouter } from 'next/router';
import { validateEmail } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ValidateEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateEmail({ code });
      router.push('/onboarding/login');
    } catch (err) {
      setError('Validation error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-4">Email Validation</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="code"
              placeholder="Validation Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
              Validate
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
