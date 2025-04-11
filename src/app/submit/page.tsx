'use client';

import {useState, useRef, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {useToast} from '@/hooks/use-toast';

export default function SubmitLetter() {
  const [letterText, setLetterText] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const {toast} = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


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

      recorder.onstop = async () => {
        if (audioURL) {
          // Fetch sends a GET request.
          const response = await fetch(audioURL);
          const blob = await response.blob();

          const formData = new FormData();
          formData.append('audio', blob, 'recording.wav');

          // TODO: Send formData to transcription service and set the returned text in letterText state
          // const transcription = await transcribeAudio(formData);
          // setLetterText(transcription);
          setLetterText('Transcribed text from audio.');
        }
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
  }, [recording, mediaRecorder, audioURL]);

  const toggleRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
    } else {
      setRecording(true);
    }
  };

  const handleSubmit = () => {
    // Placeholder for submitting the letter
    console.log('Letter submitted:', letterText);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Submit a Letter</CardTitle>
          <CardDescription>Share your thoughts and feelings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="letter-text">Your Letter</Label>
            <Textarea
              id="letter-text"
              placeholder="Write your letter here"
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
            />
          </div>

          <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />

          { !(hasCameraPermission) && (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
          )
          }


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
