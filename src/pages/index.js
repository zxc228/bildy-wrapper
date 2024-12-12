import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Bildy Wrapper</h1>
      <p>Choose an option to proceed:</p>
      <div>
        <Link href="/onboarding/register">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Register</button>
        </Link>
        <Link href="/onboarding/login">
          <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
        </Link>
      </div>
    </div>
  );
}
