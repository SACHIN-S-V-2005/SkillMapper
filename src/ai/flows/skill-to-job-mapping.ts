'use server';
/**
 * @fileOverview This file defines a Genkit flow for mapping user skills to suitable job roles.
 *
 * - skillToJobMapping - A function that takes a list of skills and recommends job roles.
 * - SkillToJobMappingInput - The input type for the skillToJobMapping function.
 * - SkillToJobMappingOutput - The return type for the skillToJobMapping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillToJobMappingInputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills possessed by the user.'),
});
export type SkillToJobMappingInput = z.infer<typeof SkillToJobMappingInputSchema>;

const SkillToJobMappingOutputSchema = z.object({
  jobRoles: z
    .array(z.string())
    .describe('A list of job roles suitable for the user based on their skills.'),
});
export type SkillToJobMappingOutput = z.infer<typeof SkillToJobMappingOutputSchema>;

export async function skillToJobMapping(input: SkillToJobMappingInput): Promise<SkillToJobMappingOutput> {
  return skillToJobMappingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillToJobMappingPrompt',
  input: {schema: SkillToJobMappingInputSchema},
  output: {schema: SkillToJobMappingOutputSchema},
  prompt: `You are a career advisor. A user has the following skills: {{{skills}}}. Recommend a list of job roles that would be suitable for them.`,
});

const skillToJobMappingFlow = ai.defineFlow(
  {
    name: 'skillToJobMappingFlow',
    inputSchema: SkillToJobMappingInputSchema,
    outputSchema: SkillToJobMappingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
