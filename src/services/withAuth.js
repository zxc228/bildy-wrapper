import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        router.push('/'); // Send user back to homepage if there's no token
      }
    }, []);

    return <Component {...props} />;
  };
}
