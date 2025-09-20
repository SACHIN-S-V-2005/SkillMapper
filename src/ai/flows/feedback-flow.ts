'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing feedback on a user's answer to an interview question.
 *
 * - generateFeedback - A function that takes a question and answer and provides feedback.
 * - FeedbackInput - The input type for the generateFeedback function.
 * - FeedbackOutput - The return type for the generateFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FeedbackInputSchema = z.object({
  question: z.string().describe('The interview question that was asked.'),
  answer: z.string().describe("The user's spoken answer to the question."),
});
export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

const FeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Constructive feedback on the user\'s answer. It should be concise, helpful, and encouraging.'
    ),
});
export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

/**
 * Analyzes a user's answer to an interview question and provides feedback.
 * @param input - The question and the user's answer.
 * @returns Constructive feedback.
 */
export async function generateFeedback(
  input: FeedbackInput
): Promise<FeedbackOutput> {
  return feedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'feedbackPrompt',
  input: {schema: FeedbackInputSchema},
  output: {schema: FeedbackOutputSchema},
  prompt: `You are an expert AI interview coach providing feedback on a user's answer during a mock interview.

**Interview Question:**
"{{{question}}}"

**User's Answer:**
"{{{answer}}}"

**Your Task:**
Provide concise, constructive feedback on the user's answer. Focus on the following:
1.  **Clarity and Conciseness:** Was the answer easy to understand? Was it too long or too short?
2.  **Correctness and Completeness:** Was the technical information accurate? Did they miss any key points?
3.  **Structure:** Was the answer well-organized (e.g., using the STAR method for behavioral questions)?

Keep the feedback positive and encouraging. Start with what they did well, then offer specific suggestions for improvement. The feedback should be a single, short paragraph.
`,
});

const feedbackFlow = ai.defineFlow(
  {
    name: 'feedbackFlow',
    inputSchema: FeedbackInputSchema,
    outputSchema: FeedbackOutputSchema,
  },
  async input => {
    // If the answer is empty, return a default feedback message.
    if (!input.answer?.trim()) {
      return {
        feedback:
          "It seems you didn't provide an answer. Try speaking your response clearly when you're ready.",
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
