'use client';

import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';

export default function TrackLetter() {
  const [letterId, setLetterId] = useState('');
  const [letterStatus, setLetterStatus] = useState<'received' | 'replying' | 'reply_done' | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({
    message: '',
    rating: 5, // Default rating
  });

  // Placeholder function to simulate fetching letter status
  const fetchLetterStatus = async (id: string) => {
    // In a real application, this would fetch data from Firebase
    // based on the letterId. For now, we simulate different statuses.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (id === 'replying123') {
      return 'replying';
    } else if (id === 'done456') {
      return 'reply_done';
    } else if (id === 'received789') {
      return 'received';
    } else {
      return null; // Not found
    }
  };

  const handleTrack = async () => {
    const status = await fetchLetterStatus(letterId);
    setLetterStatus(status);
    setFeedbackSubmitted(false); // Reset feedback status on each track
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback({...feedback, message: e.target.value});
  };

  const handleSubmitFeedback = () => {
    // Placeholder for submitting feedback
    console.log('Feedback submitted:', feedback);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle>Track Your Letter</CardTitle>
          <CardDescription>Enter your unique letter ID to check the status.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="letter-id">Letter ID</Label>
            <Input
              id="letter-id"
              placeholder="Unique Letter ID"
              value={letterId}
              onChange={(e) => setLetterId(e.target.value)}
            />
          </div>
          <Button onClick={handleTrack}>Track</Button>

          {letterStatus && (
            <div className="mt-4">
              <p>
                Status: <strong>{letterStatus.replace('_', ' ')}</strong>
              </p>

              {letterStatus === 'reply_done' && !feedbackSubmitted && (
                <div className="mt-4">
                  <CardTitle className="text-md">Feedback</CardTitle>
                  <div className="grid gap-2">
                    <Label htmlFor="feedback-message">Message</Label>
                    <Textarea
                      id="feedback-message"
                      placeholder="Share your thoughts"
                      value={feedback.message}
                      onChange={handleFeedbackChange}
                    />
                  </div>
                  <Button onClick={handleSubmitFeedback} className="mt-2">
                    Submit Feedback
                  </Button>
                </div>
              )}

              {letterStatus === 'reply_done' && feedbackSubmitted && (
                <p className="text-green-500 mt-2">Thank you for your feedback!</p>
              )}
            </div>
          )}

          {letterStatus === null && letterId !== '' && (
            <p className="text-red-500 mt-2">Letter ID not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
