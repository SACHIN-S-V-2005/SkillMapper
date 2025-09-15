'use server';

/**
 * @fileOverview Mock Interview Tool for generating interview questions and answers based on targeted job roles.
 *
 * - generateInterviewQuestions - A function that generates interview questions and answers.
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
  interviews: z.array(z.object({
      question: z.string().describe('The AI-generated interview question.'),
      answer: z.string().describe('A concise and accurate answer to the question.'),
    })).describe('An array of AI-generated interview questions and answers tailored to the job role and user skills.'),
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
  prompt: `You are an AI interview coach. Your task is to generate a comprehensive list of foundational interview questions, along with answers, for a candidate based on their skills and target job role.

**Job Role:** {{{jobRole}}}

**User Skills:**
{{#each userSkills}}
- {{{this}}}
{{/each}}

Please generate 5-7 basic, introductory-level interview questions for EACH of the skills listed above. For each question, provide a concise and correct answer. The questions should test the candidate's fundamental understanding of the topic and be suitable for an initial screening.
`,
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
