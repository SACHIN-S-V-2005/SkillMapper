'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions.
 *
 * - generateQuizQuestions - A function that generates aptitude-based quiz questions for career discovery.
 * - GenerateQuizQuestionsOutput - The output type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z
    .array(z.string())
    .min(5)
    .max(10)
    .describe('An array of 5 to 10 quiz questions.'),
  options: z
    .array(z.array(z.string()))
    .describe(
      'A nested array of options. Each inner array should contain 4 string options for the corresponding question.'
    ),
  aptitudes: z
    .array(z.array(z.string()))
    .describe(
      'A nested array of aptitudes. Each inner array should contain 4 strings, where each string is the aptitude for the corresponding option.'
    ),
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

  Generate 5-10 multiple-choice questions designed to reveal a user's natural strengths and work style preferences.
  Each question must have exactly 4 options.
  Each option must be associated with a single, specific aptitude (e.g., 'Analytical', 'Creative', 'Leader', 'Detail-Oriented', 'Communicator').
  The questions should be situational and help a user understand what kind of work environment they might thrive in.

  Your output MUST be a JSON object with three keys: "questions", "options", and "aptitudes".
  - "questions" should be an array of question strings.
  - "options" should be a nested array, where each inner array contains the 4 option strings for the corresponding question.
  - "aptitudes" should be a nested array, where each inner array contains the 4 aptitude strings for the corresponding option.

  Example for a single question:
  "questions": ["When starting a new project, you are most likely to..."]
  "options": [["First, create a detailed plan and timeline.", "Brainstorm a dozen unconventional ideas.", "Organize a kickoff meeting to align the team.", "Proofread the project brief for any errors."]]
  "aptitudes": [["Detail-Oriented", "Creative", "Leader", "Analytical"]]

  Ensure the output strictly conforms to the JSON schema.
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
