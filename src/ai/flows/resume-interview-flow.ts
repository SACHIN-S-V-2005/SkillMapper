'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating interview questions from a resume.
 *
 * - generateResumeQuestions - A function that takes a resume and optional job role to generate questions.
 * - ResumeInterviewInput - The input type for the generateResumeQuestions function.
 * - ResumeInterviewOutput - The output type for the generateResumeQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeInterviewInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetRole: z
    .string()
    .optional()
    .describe('The target job role the user is interviewing for (optional).'),
});
export type ResumeInterviewInput = z.infer<typeof ResumeInterviewInputSchema>;

const ResumeInterviewOutputSchema = z.object({
  extractedKeywords: z
    .array(z.string())
    .describe(
      'A list of key skills, technologies, and concepts extracted from the resume.'
    ),
  questions: z
    .array(
      z.object({
        question: z.string().describe('The generated interview question.'),
        category: z.enum(['Technical', 'Behavioral', 'Situational']).describe('The category of the question.'),
      })
    )
    .describe(
      'A list of personalized interview questions based on the resume content and target role.'
    ),
});
export type ResumeInterviewOutput = z.infer<typeof ResumeInterviewOutputSchema>;

export async function generateResumeQuestions(
  input: ResumeInterviewInput
): Promise<ResumeInterviewOutput> {
  return resumeInterviewFlow(input);
}

const resumeInterviewPrompt = ai.definePrompt({
  name: 'resumeInterviewPrompt',
  input: {schema: ResumeInterviewInputSchema},
  output: {schema: ResumeInterviewOutputSchema},
  prompt: `You are an expert AI career coach and interview preparer. Your task is to analyze a user's resume and generate personalized interview questions.

**Instructions:**
1.  **Parse the Resume:** Carefully read the provided resume content.
2.  **Extract Keywords:** Identify and extract key skills, technologies, certifications, and notable achievements. Pay close attention to technical skills, soft skills, and project descriptions.
3.  **Generate Personalized Questions:** Create questions directly related to the extracted keywords. For example, if the resume mentions "React," a good question would be, "Can you describe a challenging project where you used React and how you overcame the obstacles?"
4.  **Add Role-Specific Questions (if applicable):** If a target role is provided, generate relevant behavioral and situational questions for that role. For example, for a "Project Manager" role, ask, "Describe a time you had to manage a project with a tight deadline."
5.  **Categorize Questions:** Classify each question as 'Technical', 'Behavioral', or 'Situational'.

**Input:**
- **Resume:** {{media url=resumeDataUri}}
{{#if targetRole}}
- **Target Role:** {{{targetRole}}}
{{/if}}

Please generate a JSON object that strictly conforms to the ResumeInterviewOutputSchema.
`,
});

const resumeInterviewFlow = ai.defineFlow(
  {
    name: 'resumeInterviewFlow',
    inputSchema: ResumeInterviewInputSchema,
    outputSchema: ResumeInterviewOutputSchema,
  },
  async input => {
    const {output} = await resumeInterviewPrompt(input);
    return output!;
  }
);
