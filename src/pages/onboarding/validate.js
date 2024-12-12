import { useState } from 'react';
import { useRouter } from 'next/router';
import { validateEmail } from '../../services/api';

export default function ValidateEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateEmail({ code });
      router.push('/onboarding/login'); // Перенаправление на страницу логина
    } catch (err) {
      setError('Validation error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Email Validation</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="code"
          placeholder="Validation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Validate</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
