'use client';

import {useAuth} from '@/hooks/use-auth';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {getAuth, signOut} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {doc, getDoc, getFirestore} from 'firebase/firestore';
import {firebaseApp} from '@/lib/firebase';

export default function ReplierDashboard() {
  const {user, isLoading} = useAuth();
  const router = useRouter();
  const [isReplier, setIsReplier] = useState(false); // New state to check if user is a replier

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const db = getFirestore(firebaseApp);
        const userRef = doc(db, 'users', user.uid); // Assuming you have a 'users' collection
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsReplier(userData.role === 'replier'); // Check if the user has the 'replier' role
        } else {
          setIsReplier(false); // If user data doesn't exist, default to not being a replier
        }
      }
    };

    if (user) {
      checkUserRole(); // Call checkUserRole when user state is available
    }
  }, [user, router]);

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

  // If the user is not a replier, redirect or show an error
  if (!isReplier) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>You do not have permission to view this page.</div>
          </CardContent>
        </Card>
      </div>
    );
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
