'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions.
 *
 * - generateQuizQuestions - A function that generates quiz questions about programming languages.
 * - GenerateQuizQuestionsOutput - The output type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z
    .array(
      z.object({
        text: z.string().describe('The text for the answer option.'),
        skill: z
          .string()
          .describe('The single, specific programming language or tech skill associated with this answer.'),
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
  prompt: `You are an AI assistant that generates quiz questions for software developers.
  
  Generate 10 multiple-choice questions related to programming languages, frameworks, and technologies.
  Each question should have 4 options.
  Each option must be associated with a single, specific skill (e.g., 'JavaScript', 'React', 'Python', 'SQL').
  The questions should be diverse and cover different areas of software development.
  Do not repeat skills across options within the same question.
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
