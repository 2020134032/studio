'use server';
/**
 * @fileOverview Analyzes the topics and emotions expressed in a letter.
 *
 * - analyzeLetterTopicsEmotions - A function that analyzes the topics and emotions in a letter.
 * - AnalyzeLetterTopicsEmotionsInput - The input type for the analyzeLetterTopicsEmotions function.
 * - AnalyzeLetterTopicsEmotionsOutput - The return type for the analyzeLetterTopicsEmotions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeLetterTopicsEmotionsInputSchema = z.object({
  letterText: z.string().describe('The text content of the letter to analyze.'),
});
export type AnalyzeLetterTopicsEmotionsInput = z.infer<typeof AnalyzeLetterTopicsEmotionsInputSchema>;

const AnalyzeLetterTopicsEmotionsOutputSchema = z.object({
  topics: z.array(
    z.string().describe('A list of topics discussed in the letter.')
  ).describe('The topics extracted from the letter.'),
  emotions: z.array(
    z.string().describe('A list of emotions expressed in the letter.')
  ).describe('The emotions detected in the letter.'),
  sentiment: z.string().describe('Overall sentiment of the letter (positive, negative, neutral).'),
});
export type AnalyzeLetterTopicsEmotionsOutput = z.infer<typeof AnalyzeLetterTopicsEmotionsOutputSchema>;

export async function analyzeLetterTopicsEmotions(
  input: AnalyzeLetterTopicsEmotionsInput
): Promise<AnalyzeLetterTopicsEmotionsOutput> {
  return analyzeLetterTopicsEmotionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLetterTopicsEmotionsPrompt',
  input: {
    schema: z.object({
      letterText: z.string().describe('The text content of the letter to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      topics: z.array(
        z.string().describe('A list of topics discussed in the letter.')
      ).describe('The topics extracted from the letter.'),
      emotions: z.array(
        z.string().describe('A list of emotions expressed in the letter.')
      ).describe('The emotions detected in the letter.'),
      sentiment: z.string().describe('Overall sentiment of the letter (positive, negative, neutral).'),
    }),
  },
  prompt: `You are an AI assistant specializing in analyzing letters to determine the topics discussed and the emotions expressed.

  Analyze the following letter and identify the key topics discussed, the emotions expressed, and the overall sentiment.

  Letter Text: {{{letterText}}}

  Provide the topics as a list of strings, the emotions as a list of strings, and the sentiment as one of "positive", "negative", or "neutral".`,
});

const analyzeLetterTopicsEmotionsFlow = ai.defineFlow<
  typeof AnalyzeLetterTopicsEmotionsInputSchema,
  typeof AnalyzeLetterTopicsEmotionsOutputSchema
>({
  name: 'analyzeLetterTopicsEmotionsFlow',
  inputSchema: AnalyzeLetterTopicsEmotionsInputSchema,
  outputSchema: AnalyzeLetterTopicsEmotionsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

