'use client';

import {useState, useRef, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {getFirestore, collection, addDoc} from 'firebase/firestore';
import {firebaseApp} from '@/lib/firebase';
import {useAuth} from '@/hooks/use-auth';
import {useRouter} from 'next/navigation';

export default function SubmitLetter() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [returnAddress, setReturnAddress] = useState('');
  const {toast} = useToast();
  const {user} = useAuth();
  const router = useRouter();
  const [letterId, setLetterId] = useState('');

  useEffect(() => {
    // Generate a unique letter ID when the component mounts
    const generateLetterId = () => {
      const timestamp = Date.now().toString(36);
      const randomId = Math.random().toString(36).substring(2, 7);
      setLetterId(`${timestamp}-${randomId}`);
    };

    generateLetterId();
  }, []);

  useEffect(() => {
    const getMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      let recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        const audioBlob = new Blob([e.data], {type: 'audio/wav'});
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      recorder.onstop = () => {
      };
    };

    if (recording) {
      if (!mediaRecorder) {
        getMediaRecorder();
      } else {
        mediaRecorder.start();
      }
    }
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [recording, mediaRecorder]);

  const toggleRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
    } else {
      setRecording(true);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to submit a letter.',
      });
      return;
    }

    if (!audioURL) {
      toast({
        variant: 'destructive',
        title: 'Recording Required',
        description: 'Please record a letter before submitting.',
      });
      return;
    }

    if (!returnAddress) {
      toast({
        variant: 'destructive',
        title: 'Return Address Required',
        description: 'Please provide a return address.',
      });
      return;
    }

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();

      const db = getFirestore(firebaseApp);
      const lettersCollection = collection(db, 'letters');

      await addDoc(lettersCollection, {
        senderId: user.uid,
        audioUrl: audioURL, // Save the audio URL
        returnAddress: returnAddress, // Save the return address
        letterId: letterId,
        status: 'received',
        createdAt: new Date(),
      });

      toast({
        title: 'Letter Submitted',
        description: 'Your letter has been submitted successfully.',
      });

      router.push('/'); // Redirect to home page after submission
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Submit a Letter</CardTitle>
          <CardDescription>Share your story through audio.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="letter-id">Letter ID</Label>
            <Input
              id="letter-id"
              placeholder="Unique Letter ID"
              value={letterId}
              readOnly // Make it read-only to display the generated ID
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="return-address">Return Address</Label>
            <Input
              id="return-address"
              placeholder="Your Return Address"
              value={returnAddress}
              onChange={(e) => setReturnAddress(e.target.value)}
            />
          </div>

          <Button type="button" onClick={toggleRecording}>
            {recording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          {audioURL && (
            <div>
              <audio ref={audioRef} src={audioURL} controls />
            </div>
          )}
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
