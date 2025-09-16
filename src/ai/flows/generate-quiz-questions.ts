
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
  prompt: `You are an AI assistant generating aptitude and logical reasoning quiz questions for a Career Quiz app.

Your task is to auto-generate multiple-choice questions that test a mix of the following categories:
- Quantitative aptitude (e.g., numbers, percentages, ratios, averages, time & work, probability)
- Logical reasoning (e.g., puzzles, series, coding-decoding, seating arrangements, syllogisms)
- Verbal aptitude (e.g., analogies, synonyms, comprehension, error spotting)
- General aptitude (e.g., problem-solving, analytical thinking)

**Rules:**
- Generate at least 5 questions per request.
- Ensure a variety of question types from the categories above.
- The difficulty should be balanced (easy, medium, hard).
- Keep language simple and options clear for mobile display.
- Do not repeat previous questions in the same session.

Format the output strictly as a JSON object conforming to the GenerateQuizQuestionsOutputSchema.
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
