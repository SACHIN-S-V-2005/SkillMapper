'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { skillToJobMapping } from '@/ai/flows/skill-to-job-mapping';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { QuizQuestion } from '@/lib/types';

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Which of these activities sounds most appealing to you?',
    options: [
      { text: 'Building a mobile app', skill: 'Mobile Development' },
      { text: 'Designing a beautiful website', skill: 'UI/UX Design' },
      { text: 'Analyzing data to find trends', skill: 'Data Analysis' },
      { text: 'Managing a team to launch a product', skill: 'Project Management' },
    ],
  },
  {
    question: 'When faced with a complex problem, you tend to:',
    options: [
      { text: 'Break it down and write code to solve it', skill: 'Software Engineering' },
      { text: 'Create wireframes and mockups', skill: 'Prototyping' },
      { text: 'Query databases and create reports', skill: 'SQL' },
      { text: 'Organize tasks and delegate', skill: 'Leadership' },
    ],
  },
  {
    question: 'What kind of work environment do you prefer?',
    options: [
      { text: 'A fast-paced, collaborative startup', skill: 'Agile Methodologies' },
      { text: 'A creative and visual-focused studio', skill: 'Creative Thinking' },
      { text: 'A data-driven, analytical team', skill: 'Statistical Analysis' },
      { text: 'A structured corporate setting', skill: 'Business Strategy' },
    ],
  },
  {
    question: 'Which tool are you most interested in learning?',
    options: [
      { text: 'React Native or Swift', skill: 'iOS/Android Development' },
      { text: 'Figma or Adobe XD', skill: 'Design Tools' },
      { text: 'Python with Pandas', skill: 'Python' },
      { text: 'Jira or Asana', skill: 'Task Management' },
    ],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (skill: string) => {
    setUserSkills((prev) => [...new Set([...prev, skill])]);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFindJobs = async () => {
    setIsLoading(true);
    try {
      const result = await skillToJobMapping({ skills: userSkills });
      setJobRoles(result.jobRoles);
    } catch (error) {
      console.error('Error fetching job roles:', error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Career Quiz</CardTitle>
          <CardDescription>
            Answer a few questions to discover your skills and potential career paths.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!quizCompleted ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-lg font-medium">
                    {quizQuestions[currentQuestion].question}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {quizQuestions[currentQuestion].options.map((option) => (
                    <Button
                      key={option.text}
                      variant="outline"
                      className="h-auto min-h-[4rem] justify-start whitespace-normal text-left"
                      onClick={() => handleAnswer(option.skill)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {jobRoles.length === 0 ? (
                  <div className="text-center">
                    <Wand2 className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-xl font-semibold">Quiz Complete!</h3>
                    <p className="mt-2 text-muted-foreground">
                      Based on your answers, we've identified these skills:
                    </p>
                    <div className="my-4 flex flex-wrap justify-center gap-2">
                      {userSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button onClick={handleFindJobs} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finding Job Roles...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Let AI Find Job Roles for You
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="mb-4 text-center text-xl font-semibold">
                      Recommended Job Roles
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {jobRoles.map((role) => (
                        <Card key={role}>
                          <CardHeader>
                            <CardTitle className="text-lg">{role}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        {!quizCompleted && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
