'use client';

import {useAuth} from '@/hooks/use-auth';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {getAuth, signOut} from 'firebase/auth';
import {useRouter} from 'next/navigation';

export default function ReplierDashboard() {
  const {user, isLoading} = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Replier Access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>Please login as a replier to view this page.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Replier Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>Welcome, Replier!</div>
          <Button onClick={handleLogout} className="mb-4">
            Logout
          </Button>
          {/* Add more replier-specific content here */}
        </CardContent>
      </Card>
    </div>
  );
}
