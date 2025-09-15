'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a "Day in the Life" timeline for a professional role.
 *
 * - generateDayInLife - A function that creates a simulated daily schedule for a given job role and experience level.
 * - DayInLifeInput - The input type for the generateDayInLife function.
 * - DayInLifeOutput - The output type for the generateDayInLife function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const DayInLifeInputSchema = z.object({
    jobRole: z.string().describe('The job role to generate a timeline for (e.g., Software Developer).'),
    experienceLevel: z.enum(['Intern', 'Junior', 'Senior', 'Lead']).describe('The experience level for the role.'),
});

export type DayInLifeInput = z.infer<typeof DayInLifeInputSchema>;

const DayInLifeOutputSchema = z.object({
    timeline: z.array(
        z.object({
            time: z.string().describe('The time of the event (e.g., "9:00 AM").'),
            title: z.string().describe('A short title for the task or event.'),
            description: z.string().describe('A storytelling description of the activity.'),
            icon: z.enum(['Coffee', 'Code', 'Users', 'Presentation', 'Brain', 'BarChart', 'Lunch', 'FileText', 'MessageSquare']).describe('An icon name that best represents the activity.'),
        })
    ).describe('A chronologically ordered list of daily activities.'),
});

export type DayInLifeOutput = z.infer<typeof DayInLifeOutputSchema>;

/**
 * Generates a "Day in the Life" timeline for a professional role.
 * @param input - The job role and experience level.
 * @returns A simulated daily schedule.
 */
export async function generateDayInLife(input: DayInLifeInput): Promise<DayInLifeOutput> {
    return dayInLifeFlow(input);
}


const dayInLifePrompt = ai.definePrompt({
  name: 'dayInLifePrompt',
  input: {schema: DayInLifeInputSchema},
  output: {schema: DayInLifeOutputSchema},
  prompt: `
    You are a career narrator. Your task is to generate a realistic and engaging "Day in the Life" timeline for a professional.

    **Job Role:** {{{jobRole}}}
    **Experience Level:** {{{experienceLevel}}}

    Create a daily schedule in chronological order, starting from the morning. Each entry must include a time, a title, a story-driven description, and a relevant icon.

    **Instructions:**
    1.  **Be Realistic:** The schedule should reflect the typical activities, meetings, and breaks for a {{{experienceLevel}}} {{{jobRole}}}. A 'Senior' role might have more strategic meetings, while an 'Intern' might have more learning and supervised tasks.
    2.  **Use Storytelling:** Don't just list tasks. Describe them in an engaging way. For example, instead of "Code review," say "Collaborates with a junior developer, providing constructive feedback on their latest code pull request to enhance code quality and mentor them."
    3.  **Icon Mapping:** Assign one of the following icons to each activity: 'Coffee', 'Code', 'Users' (for meetings), 'Presentation', 'Brain' (for brainstorming/ideation), 'BarChart' (for analytics/data), 'Lunch', 'FileText' (for documentation), 'MessageSquare' (for communication).
    4.  **Chronological Order:** The timeline must be in a logical time-based sequence.
    
    Generate the output as a JSON object that strictly conforms to the DayInLifeOutputSchema.
  `,
});


const dayInLifeFlow = ai.defineFlow(
  {
    name: 'dayInLifeFlow',
    inputSchema: DayInLifeInputSchema,
    outputSchema: DayInLifeOutputSchema,
  },
  async input => {
    const {output} = await dayInLifePrompt(input);
    return output!;
  }
);
