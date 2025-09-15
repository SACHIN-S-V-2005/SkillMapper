'use server';
/**
 * @fileOverview This file defines a Genkit flow for mapping user aptitudes to suitable job roles.
 *
 * - aptitudeToJobMapping - A function that takes a list of aptitudes and recommends job roles.
 * - AptitudeToJobMappingInput - The input type for the aptitudeToJobMapping function.
 * - AptitudeToJobMappingOutput - The return type for the aptitudeToJobMapping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AptitudeToJobMappingInputSchema = z.object({
  aptitudes: z
    .array(z.string())
    .describe('A list of aptitudes or traits possessed by the user.'),
});
export type AptitudeToJobMappingInput = z.infer<typeof AptitudeToJobMappingInputSchema>;

const AptitudeToJobMappingOutputSchema = z.object({
  jobRoles: z
    .array(z.string())
    .describe('A list of job roles suitable for the user based on their aptitudes.'),
});
export type AptitudeToJobMappingOutput = z.infer<typeof AptitudeToJobMappingOutputSchema>;

export async function aptitudeToJobMapping(input: AptitudeToJobMappingInput): Promise<AptitudeToJobMappingOutput> {
  return aptitudeToJobMappingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aptitudeToJobMappingPrompt',
  input: {schema: AptitudeToJobMappingInputSchema},
  output: {schema: AptitudeToJobMappingOutputSchema},
  prompt: `You are a career advisor. A user has the following aptitudes: {{{aptitudes}}}. Recommend a list of job roles that would be suitable for them.`,
});

const aptitudeToJobMappingFlow = ai.defineFlow(
  {
    name: 'aptitudeToJobMappingFlow',
    inputSchema: AptitudeToJobMappingInputSchema,
    outputSchema: AptitudeToJobMappingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
