'use client';

import {useAuth} from '@/hooks/use-auth';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useState} from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import {firebaseApp} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {getAuth, signOut} from 'firebase/auth';
import {useRouter} from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Letter {
  id: string;
  senderId: string;
  status: string;
  createdAt: string;
  replyerId?: string;
  replyNote?: string;
  feedback?: {
    message: string;
    rating: number;
  };
}

export default function ManagerDashboard() {
  const {user, isLoading} = useAuth();
  const [letters, setLetters] = useState<Letter[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLetters = async () => {
      if (!user) return;

      const db = getFirestore(firebaseApp);
      const lettersCollection = collection(db, 'letters');
      const q = query(lettersCollection, orderBy('createdAt', 'desc'), limit(10)); // Limiting to 10 for performance
      const querySnapshot = await getDocs(q);

      const lettersData: Letter[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Letter, 'id'>),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A', // Format timestamp
      })) as Letter[];
      setLetters(lettersData);
    };

    if (user) {
      fetchLetters();
    }
  }, [user]);

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Bypass authentication for test mode
  const enterTestMode = () => {
    router.push('/manager');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle>Manager Access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>Please login as a manager to view this page.</div>
            <Button onClick={enterTestMode} className="mb-4">
              Enter Test Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-4xl p-4">
        <CardHeader>
          <CardTitle>Manager Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>Welcome, Manager!</div>
          <Button onClick={handleLogout} className="mb-4">
            Logout
          </Button>

          <Table>
            <TableCaption>A list of recent letters in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Replier ID</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {letters.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell className="font-medium">{letter.senderId}</TableCell>
                  <TableCell>{letter.status}</TableCell>
                  <TableCell>{letter.createdAt}</TableCell>
                  <TableCell>{letter.replyerId || 'N/A'}</TableCell>
                  <TableCell>{letter.feedback?.message || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
