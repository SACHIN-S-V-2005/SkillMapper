'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant courses to users based on their profile and career goals.
 *
 * @remarks
 * The flow takes user profile data and career goals as input, leverages an AI model to analyze this information,
 * and recommends a list of courses from platforms like Coursera and edX.
 *
 * @exports {
 *   suggestCourses - The main function to trigger the course suggestion flow.
 *   AICourseSuggestionInput - The input type for the suggestCourses function.
 *   AICourseSuggestionOutput - The output type for the suggestCourses function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const AICourseSuggestionInputSchema = z.object({
  userProfile: z.string().describe('A detailed description of the user\'s skills, experience, and educational background.'),
  careerGoals: z.string().describe('The user\'s desired career path and specific goals.'),
  platforms: z.array(z.enum(['Coursera', 'edX', 'Udacity'])).optional().describe('Preferred learning platforms (optional). If not specified, all platforms are considered.'),
});

export type AICourseSuggestionInput = z.infer<typeof AICourseSuggestionInputSchema>;

const AICourseSuggestionOutputSchema = z.object({
  courseRecommendations: z.array(
    z.object({
      title: z.string().describe('The title of the recommended course.'),
      platform: z.string().describe('The platform offering the course (e.g., Coursera, edX).'),
      url: z.string().url().describe('The URL of the course.'),
      relevanceScore: z.number().min(0).max(1).describe('A score indicating the relevance of the course to the user\'s profile and goals (0-1).'),
      reasoning: z.string().describe('Explanation of why the course is a good fit for the user.')
    })
  ).describe('A list of recommended courses with details.'),
});

export type AICourseSuggestionOutput = z.infer<typeof AICourseSuggestionOutputSchema>;


/**
 * Analyzes user profile and career goals to recommend relevant courses.
 * @param input - User profile and career goals.
 * @returns A list of recommended courses.
 */
export async function suggestCourses(input: AICourseSuggestionInput): Promise<AICourseSuggestionOutput> {
  return aiCourseSuggestionFlow(input);
}

const aiCourseSuggestionPrompt = ai.definePrompt({
  name: 'aiCourseSuggestionPrompt',
  input: {schema: AICourseSuggestionInputSchema},
  output: {schema: AICourseSuggestionOutputSchema},
  prompt: `You are an AI career counselor specializing in recommending online courses.

  Analyze the following user profile and career goals, and provide a list of courses from platforms like Coursera, edX, and Udacity that would be most helpful for the user to achieve their goals.

  Consider the user's existing skills and experience, and identify courses that will help them develop new skills and knowledge relevant to their desired career path.

  User Profile: {{{userProfile}}}
  Career Goals: {{{careerGoals}}}
  Preferred Platforms (if any): {{#if platforms}}{{{platforms}}}{{else}}Any platform{{/if}}

  Format the output as a JSON object conforming to the AICourseSuggestionOutputSchema schema, including a relevance score (0-1) and reasoning for each course recommendation.
  `,
});


const aiCourseSuggestionFlow = ai.defineFlow(
  {
    name: 'aiCourseSuggestionFlow',
    inputSchema: AICourseSuggestionInputSchema,
    outputSchema: AICourseSuggestionOutputSchema,
  },
  async input => {
    const {output} = await aiCourseSuggestionPrompt(input);
    return output!;
  }
);
