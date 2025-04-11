// use server'
'use server';
/**
 * @fileOverview This file defines a Genkit flow to transcribe audio letters into text.
 *
 * - transcribeAudioLetter - A function that takes an audio URL and returns the transcribed text.
 * - TranscribeAudioLetterInput - The input type for the transcribeAudioLetter function.
 * - TranscribeAudioLetterOutput - The return type for the transcribeAudioLetter function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {transcribeAudio} from '@/services/audio-transcription';

const TranscribeAudioLetterInputSchema = z.object({
  audioUrl: z.string().describe('The URL of the audio file to transcribe.'),
});
export type TranscribeAudioLetterInput = z.infer<typeof TranscribeAudioLetterInputSchema>;

const TranscribeAudioLetterOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioLetterOutput = z.infer<typeof TranscribeAudioLetterOutputSchema>;

export async function transcribeAudioLetter(input: TranscribeAudioLetterInput): Promise<TranscribeAudioLetterOutput> {
  return transcribeAudioLetterFlow(input);
}

const transcribeAudioLetterFlow = ai.defineFlow<
  typeof TranscribeAudioLetterInputSchema,
  typeof TranscribeAudioLetterOutputSchema
>(
  {
    name: 'transcribeAudioLetterFlow',
    inputSchema: TranscribeAudioLetterInputSchema,
    outputSchema: TranscribeAudioLetterOutputSchema,
  },
  async input => {
    const transcriptionResult = await transcribeAudio(input.audioUrl);
    return {text: transcriptionResult.text};
  }
);
