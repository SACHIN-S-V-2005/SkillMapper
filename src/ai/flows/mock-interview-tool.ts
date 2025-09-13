'use server';

/**
 * @fileOverview Mock Interview Tool for generating interview questions based on targeted job roles.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInterviewQuestionsInputSchema = z.object({
  jobRole: z.string().describe('The targeted job role for the interview.'),
  userSkills: z.array(z.string()).describe('List of skills possessed by the user.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of AI-generated interview questions tailored to the job role and user skills.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an AI interview question generator. You will be given a job role and a list of skills.
  You will generate a list of interview questions tailored to the job role and the skills of the candidate.

  Job Role: {{{jobRole}}}
  User Skills:
  {{#each userSkills}}
  - {{{this}}}
  {{/each}}

  Please provide {{arrayLength userSkills}} interview questions suitable for this candidate, considering their skills and the requirements of the job.
  Ensure that the questions are diverse and cover various aspects of the job role.
  `,
  templateHelpers: {
    arrayLength: (array: any[]) => array.length,
  },
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
