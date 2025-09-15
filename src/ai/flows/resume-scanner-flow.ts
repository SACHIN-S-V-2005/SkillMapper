'use server';
/**
 * @fileOverview This file defines a Genkit flow for scanning and analyzing a user's resume.
 *
 * - analyzeResume - A function that takes a resume and provides a detailed analysis.
 * - ResumeAnalysisInput - The input type for the analyzeResume function.
 * - ResumeAnalysisOutput - The output type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeAnalysisInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetRole: z
    .string()
    .optional()
    .describe(
      'The target job role to tailor the resume analysis for (optional).'
    ),
});
export type ResumeAnalysisInput = z.infer<typeof ResumeAnalysisInputSchema>;

const ResumeAnalysisOutputSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An overall score for the resume from 0 to 100, based on content, formatting, and relevance.'
    ),
  positivePoints: z
    .array(z.string())
    .describe('A list of things the resume does well.'),
  areasForImprovement: z
    .array(
      z.object({
        area: z.string().describe('The section or aspect to improve (e.g., "Summary", "Experience Section").'),
        suggestion: z.string().describe('A specific, actionable suggestion for improvement.'),
      })
    )
    .describe('A list of specific suggestions for improvement.'),
  keywordAnalysis: z.object({
    missingKeywords: z
      .array(z.string())
      .describe(
        'A list of relevant keywords missing from the resume, especially if a target role is provided.'
      ),
    presentKeywords: z
      .array(z.string())
      .describe('A list of strong, relevant keywords already present in the resume.'),
  }),
  formattingAnalysis: z.object({
    consistency: z
      .string()
      // .describe('Feedback on font, date format, and layout consistency.'),
      .describe('Feedback on font usage, date formats, and overall layout consistency.'),
    readability: z
      .string()
      .describe(
        'Feedback on how easy the resume is to read (e.g., use of white space, bullet points).'
      ),
  }),
  contactInfoCheck: z.object({
    hasEmail: z.boolean().describe('Whether an email address was found.'),
    hasPhone: z.boolean().describe('Whether a phone number was found.'),
    hasLinkedIn: z.boolean().describe('Whether a LinkedIn profile URL was found.'),
  }),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;

export async function analyzeResume(
  input: ResumeAnalysisInput
): Promise<ResumeAnalysisOutput> {
  return resumeScannerFlow(input);
}

const resumeScannerPrompt = ai.definePrompt({
  name: 'resumeScannerPrompt',
  input: {schema: ResumeAnalysisInputSchema},
  output: {schema: ResumeAnalysisOutputSchema},
  prompt: `You are an expert AI resume reviewer and career coach. Your task is to perform a comprehensive analysis of the provided resume.

**Instructions:**
1.  **Parse the Resume:** Carefully read the entire resume content provided via the data URI.
2.  **Score the Resume:** Assign an 'overallScore' between 0 and 100. Base this score on:
    - Clarity and impact of the content.
    - Formatting, readability, and consistency.
    - Presence of essential sections (Contact, Experience, Education, Skills).
    - Relevance to the 'targetRole' if provided.
3.  **Identify Strengths:** List the key strengths of the resume in 'positivePoints'.
4.  **Suggest Improvements:** Provide specific, actionable feedback in 'areasForImprovement'. Focus on weak sections, unclear descriptions, or missing information.
5.  **Analyze Keywords:**
    - Extract strong, relevant keywords from the resume and list them in 'presentKeywords'.
    - Suggest important 'missingKeywords', especially those relevant to the 'targetRole'.
6.  **Analyze Formatting:**
    - Check for 'consistency' in fonts, date formats, and section layouts.
    - Evaluate 'readability', including use of white space, bullet points, and sentence structure.
7.  **Check Contact Info:** Verify the presence of email, phone number, and a LinkedIn profile URL.

**Input:**
- **Resume:** {{media url=resumeDataUri}}
{{#if targetRole}}
- **Target Role for Analysis:** {{{targetRole}}}
{{/if}}

Please generate a JSON object that strictly conforms to the ResumeAnalysisOutputSchema. Be thorough and provide constructive, professional feedback.
`,
});

const resumeScannerFlow = ai.defineFlow(
  {
    name: 'resumeScannerFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await resumeScannerPrompt(input);
    return output!;
  }
);
