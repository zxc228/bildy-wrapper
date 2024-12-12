import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Удаляем токен из localStorage
    router.push('/'); // Перенаправляем на страницу логина
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #ddd' }}>
      <h1>Bildy Wrapper</h1>
      <nav>
        <Link href="/clients">Clients</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/delivery-notes">Delivery Notes</Link>
        <button 
          onClick={handleLogout} 
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0',
            fontSize: '16px',
          }}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
