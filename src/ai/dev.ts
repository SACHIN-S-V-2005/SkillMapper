'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/skill-to-job-mapping.ts';
import '@/ai/flows/ai-course-suggestion.ts';
import '@/ai/flows/mock-interview-tool.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/project-suggestion-flow.ts';
import '@/ai/flows/skill-analysis-flow.ts';
import '@/ai/flows/day-in-life-flow.ts';
import '@/ai/flows/resume-interview-flow.ts';
import '@/ai/flows/resume-scanner-flow.ts';
