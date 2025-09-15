'use server';

/**
 * @fileOverview This file defines a Genkit flow for skill gap analysis and roadmap generation.
 *
 * - skillAnalysis - A function that analyzes skill gaps for a desired role and generates a learning roadmap.
 * - SkillAnalysisInput - The input type for the skillAnalysis function.
 * - SkillAnalysisOutput - The output type for the skillAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillAnalysisInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  desiredRole: z.string().describe('The desired career role the user wants to achieve (e.g., Data Analyst, Full-Stack Developer).'),
});
export type SkillAnalysisInput = z.infer<typeof SkillAnalysisInputSchema>;

const SkillAnalysisOutputSchema = z.object({
  existingSkills: z.array(
    z.object({
      skill: z.string().describe('An existing skill the user has.'),
      level: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The assessed proficiency level of the skill.'),
    })
  ).describe("An analysis of the user's existing skills with proficiency levels."),
  missingSkills: z.array(
    z.object({
      skill: z.string().describe('A skill that is required for the desired role but the user is missing.'),
      reasoning: z.string().describe('A brief explanation of why this skill is important for the desired role.'),
    })
  ).describe('A list of skills the user is missing to qualify for the desired role.'),
  skillRoadmap: z.array(
    z.object({
      step: z.number().describe('The step number in the roadmap.'),
      skill: z.string().describe('The skill to learn in this step.'),
      description: z.string().describe('A brief description of what to learn and why it is important for the roadmap.'),
    })
  ).describe('A step-by-step learning roadmap to acquire the missing skills, progressing from beginner to advanced topics.'),
  recommendedResources: z.array(
    z.object({
      skill: z.string().describe('The skill this resource is for.'),
      title: z.string().describe('The title of the recommended course or resource.'),
      platform: z.string().describe('The platform offering the resource (e.g., GeeksforGeeks, Javatpoint, W3Schools).'),
      url: z.string().url().describe('The direct URL to the course or resource.'),
    })
  ).describe('A list of recommended online courses and certifications to learn the missing skills.')
});

export type SkillAnalysisOutput = z.infer<typeof SkillAnalysisOutputSchema>;


export async function skillAnalysis(input: SkillAnalysisInput): Promise<SkillAnalysisOutput> {
  return skillAnalysisFlow(input);
}


const skillAnalysisPrompt = ai.definePrompt({
  name: 'skillAnalysisPrompt',
  input: {schema: SkillAnalysisInputSchema},
  output: {schema: SkillAnalysisOutputSchema},
  prompt: `You are an expert AI career coach. Your task is to perform a detailed skill gap analysis for a user who wants to achieve a specific career role.

First, parse the provided resume to identify the user's current skills. Then, compare them against the requirements for their desired role.

**Resume:**
{{media url=resumeDataUri}}

**Desired Career Role:** {{{desiredRole}}}

**Your Analysis Must Include:**

1.  **Existing Skills Analysis:**
    *   Evaluate the skills extracted from the resume.
    *   Categorize each skill into one of three proficiency levels: 'Beginner', 'Intermediate', or 'Advanced' based on its context and relation to other skills.

2.  **Missing Skills (Gaps):**
    *   Identify the crucial skills required for the '{{{desiredRole}}}' role that are missing from the user's skill list.
    *   For each missing skill, provide a brief reasoning for its importance.

3.  **Skill Roadmap:**
    *   Create a logical, step-by-step learning roadmap to bridge the skill gap.
    *   The roadmap should start with foundational (Beginner) skills and progress to more Advanced topics.
    *   Provide a clear description for each step.

4.  **Recommended Resources:**
    *   For each major missing skill, recommend specific online tutorials or articles.
    *   **CRITICAL INSTRUCTION: You must ONLY suggest resources from the following websites: GeeksforGeeks, Javatpoint, or W3Schools.**
    *   **You must provide real, valid, and working URLs. Do not invent URLs or create placeholder links. Every URL must lead to a real, accessible page. Prefer linking to a main topic or search page (e.g., https://www.w3schools.com/sql/) instead of a very specific, deep link that might break.**

Please generate the output in a JSON object that strictly conforms to the SkillAnalysisOutputSchema.
`,
});


const skillAnalysisFlow = ai.defineFlow(
  {
    name: 'skillAnalysisFlow',
    inputSchema: SkillAnalysisInputSchema,
    outputSchema: SkillAnalysisOutputSchema,
  },
  async input => {
    const {output} = await skillAnalysisPrompt(input);
    return output!;
  }
);
