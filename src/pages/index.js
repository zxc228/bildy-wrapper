import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bildy Wrapper</h1>
        <p className="text-lg mb-6">Choose an option to proceed:</p>
        <div className="flex space-x-4">
          <Link href="/onboarding/register">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
              Register
            </button>
          </Link>
          <Link href="/onboarding/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
              Login
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
