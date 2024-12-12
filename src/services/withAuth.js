import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        router.push('/'); // Перенаправление на главную страницу, если токен отсутствует
      }
    }, []);

    return <Component {...props} />;
  };
}
