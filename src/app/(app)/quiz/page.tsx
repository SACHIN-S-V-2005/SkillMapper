'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { skillToJobMapping } from '@/ai/flows/skill-to-job-mapping';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import type { GenerateQuizQuestionsOutput } from '@/ai/flows/generate-quiz-questions';


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
import { useToast } from '@/hooks/use-toast';

export default function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFindingJobs, setIsFindingJobs] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setUserSkills([]);
    setJobRoles([]);
    setQuizCompleted(false);

    try {
      const result = await generateQuizQuestions();
      setQuizQuestions(result.questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load quiz',
        description: 'Could not generate new questions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);


  const handleAnswer = (skill: string) => {
    setUserSkills((prev) => [...new Set([...prev, skill])]);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFindJobs = async () => {
    setIsFindingJobs(true);
    try {
      const result = await skillToJobMapping({ skills: userSkills });
      setJobRoles(result.jobRoles);
    } catch (error) {
      console.error('Error fetching job roles:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to find job roles. Please try again.',
      });
    } finally {
      setIsFindingJobs(false);
    }
  };

  const progress = quizQuestions.length > 0 ? ((currentQuestion) / quizQuestions.length) * 100 : 0;
  const finalProgress = (quizQuestions.length / quizQuestions.length) * 100;

  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating your personalized quiz...</p>
        </div>
      )
    }

    if (quizCompleted) {
       return (
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
              <Button onClick={handleFindJobs} disabled={isFindingJobs}>
                {isFindingJobs ? (
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
               <div className="mt-6 text-center">
                  <Button variant="outline" onClick={fetchQuestions}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Another Quiz
                  </Button>
              </div>
            </div>
          )}
        </motion.div>
      )
    }

    if (quizQuestions.length > 0) {
      return (
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
      )
    }

    return (
       <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground mb-4">Could not load quiz questions.</p>
            <Button onClick={fetchQuestions}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Career Quiz</CardTitle>
          <CardDescription>
            Answer a few questions to discover your skills and potential career paths.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[20rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
            { !isLoading && quizQuestions.length > 0 && (
                <p className="text-xs text-muted-foreground w-full">
                  { !quizCompleted
                      ? `Question ${currentQuestion + 1} of ${quizQuestions.length}`
                      : 'Quiz completed! See your results above.'
                  }
                </p>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
