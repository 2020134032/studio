// File: src/ai/flows/suggest-reply.ts
'use server';
/**
 * @fileOverview An AI agent that suggests appropriate responses or tone for a letter replier.
 *
 * - suggestReply - A function that suggests a reply to a letter.
 * - SuggestReplyInput - The input type for the suggestReply function.
 * - SuggestReplyOutput - The return type for the suggestReply function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestReplyInputSchema = z.object({
  letterContent: z.string().describe('The content of the original letter.'),
});
export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;

const SuggestReplyOutputSchema = z.object({
  suggestedReply: z.string().describe('The AI suggested reply to the letter.'),
});
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;

export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {
    schema: z.object({
      letterContent: z.string().describe('The content of the original letter.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedReply: z.string().describe('The AI suggested reply to the letter.'),
    }),
  },
  prompt: `You are an AI assistant helping volunteers reply to letters.

  Given the content of the original letter, suggest an appropriate and empathetic response.

  Original Letter Content: {{{letterContent}}}

  Suggested Reply:`,
});

const suggestReplyFlow = ai.defineFlow<
  typeof SuggestReplyInputSchema,
  typeof SuggestReplyOutputSchema
>({
  name: 'suggestReplyFlow',
  inputSchema: SuggestReplyInputSchema,
  outputSchema: SuggestReplyOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
