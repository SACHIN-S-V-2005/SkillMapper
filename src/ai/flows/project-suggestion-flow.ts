'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting portfolio projects based on a job role.
 *
 * - suggestProjects - A function that takes a job role and suggests relevant project ideas.
 * - ProjectSuggestionInput - The input type for the suggestProjects function.
 * - ProjectSuggestionOutput - The output type for the suggestProjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectSuggestionInputSchema = z.object({
  jobRole: z.string().describe('The target job role for which to suggest projects.'),
});

export type ProjectSuggestionInput = z.infer<typeof ProjectSuggestionInputSchema>;

const ProjectSuggestionOutputSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string().describe('The title of the project idea.'),
      description: z.string().describe('A brief description of the project.'),
      technologies: z.array(z.string()).describe('A list of recommended technologies or skills to use for this project.'),
    })
  ).describe('A list of 3-5 project suggestions.'),
});

export type ProjectSuggestionOutput = z.infer<typeof ProjectSuggestionOutputSchema>;

/**
 * Suggests portfolio projects for a given job role.
 * @param input - The target job role.
 * @returns A list of project suggestions.
 */
export async function suggestProjects(input: ProjectSuggestionInput): Promise<ProjectSuggestionOutput> {
  return projectSuggestionFlow(input);
}

const projectSuggestionPrompt = ai.definePrompt({
  name: 'projectSuggestionPrompt',
  input: {schema: ProjectSuggestionInputSchema},
  output: {schema: ProjectSuggestionOutputSchema},
  prompt: `
    You are a senior software engineer and career mentor.
    A user wants to build their portfolio to land a job as a {{{jobRole}}}.

    Please suggest 3 to 5 project ideas that would be impressive for this role.
    For each project, provide a compelling title, a brief but clear description of the project's goal and features,
    and a list of key technologies or skills they would demonstrate by building it.

    Ensure the projects are practical for a single person to build and are relevant to the current industry standards for the specified job role.
  `,
});


const projectSuggestionFlow = ai.defineFlow(
  {
    name: 'projectSuggestionFlow',
    inputSchema: ProjectSuggestionInputSchema,
    outputSchema: ProjectSuggestionOutputSchema,
  },
  async input => {
    const {output} = await projectSuggestionPrompt(input);
    return output!;
  }
);
