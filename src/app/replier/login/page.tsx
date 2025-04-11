'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {signInWithEmailAndPassword, getAuth} from 'firebase/auth';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {firebaseApp} from '@/lib/firebase';

export default function ReplierLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const auth = getAuth(firebaseApp);
      await signInWithEmailAndPassword(auth, email, password);
      // If login is successful, redirect to the replier dashboard
      router.push('/replier');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Replier Login</CardTitle>
          <CardDescription>Enter your credentials to access the replier dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit">Login</Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
