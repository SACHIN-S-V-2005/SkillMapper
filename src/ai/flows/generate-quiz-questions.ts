'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions.
 *
 * - generateQuizQuestions - A function that generates aptitude-based quiz questions for career discovery.
 * - GenerateQuizQuestionsOutput - The output type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The aptitude-based quiz question.'),
  options: z
    .array(
      z.object({
        text: z.string().describe('The text for the answer option.'),
        aptitude: z
          .string()
          .describe('The single, specific aptitude or personality trait associated with this answer (e.g., Analytical, Creative, Leader).'),
      })
    )
    .min(4)
    .describe('An array of 4 possible answers.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(5)
    .max(10)
    .describe('An array of 5 to 10 quiz questions.'),
});

export type GenerateQuizQuestionsOutput = z.infer<
  typeof GenerateQuizQuestionsOutputSchema
>;

export async function generateQuizQuestions(): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an AI assistant that generates aptitude-based quiz questions for career discovery.

  Generate 10 multiple-choice questions designed to reveal a user's natural strengths and work style preferences.
  Each question should have 4 options.
  Each option must be associated with a single, specific aptitude (e.g., 'Analytical', 'Creative', 'Leader', 'Detail-Oriented', 'Communicator').
  The questions should be situational and help a user understand what kind of work environment they might thrive in.
  Do not repeat aptitudes across options within the same question.
  Ensure the output is a JSON object that conforms to the specified schema.
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
