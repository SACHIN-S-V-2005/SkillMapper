'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating career quiz questions.
 *
 * - generateQuizQuestions - A function that generates aptitude and skill-based quiz questions.
 * - GenerateQuizQuestionsOutput - The output type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the quiz question.'),
      options: z
        .array(z.string())
        .length(4)
        .describe('An array of exactly 4 answer options.'),
      answer: z.string().describe('The correct answer text from the options.'),
    })
  ).min(5).describe('An array of at least 5 quiz questions.'),
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
  prompt: `You are an AI assistant that generates multiple-choice quiz questions for students preparing for careers.

  Your task is to generate at least 5 questions that test a mix of aptitude, logical reasoning, general career awareness, and basic technical skills.

  - The questions should have mixed difficulty levels (easy, medium, hard).
  - The questions should be short and simple for mobile app display.
  - Options should be clear and not repetitive.

  Format the output strictly as a JSON object conforming to the GenerateQuizQuestionsOutputSchema.
  For each question, provide the question text, an array of 4 options, and the string of the correct answer.
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
