'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { aptitudeToJobMapping } from '@/ai/flows/aptitude-to-job-mapping';
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
  const [userAptitudes, setUserAptitudes] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFindingJobs, setIsFindingJobs] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setUserAptitudes([]);
    setJobRoles([]);
    setQuizCompleted(false);

    try {
      const result:GenerateQuizQuestionsOutput = await generateQuizQuestions();
      const formattedQuestions = result.questions.map((question, index) => {
        return {
          question,
          options: result.options[index].map((optionText, optionIndex) => {
            return {
              text: optionText,
              skill: result.aptitudes[index][optionIndex],
            };
          }),
        };
      });
      setQuizQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      let description = 'Could not generate new questions. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
          description = 'You have exceeded the daily limit for quiz generation. Please try again tomorrow.';
        } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
          description = 'The AI service is currently busy. Please wait a moment and try again.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Failed to load quiz',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAnswer = (aptitude: string) => {
    setUserAptitudes((prev) => [...new Set([...prev, aptitude])]);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFindJobs = async () => {
    setIsFindingJobs(true);
    try {
      const result = await aptitudeToJobMapping({ aptitudes: userAptitudes });
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
                Based on your answers, we've identified these aptitudes:
              </p>
              <div className="my-4 flex flex-wrap justify-center gap-2">
                {userAptitudes.map((aptitude) => (
                  <Badge key={aptitude} variant="secondary">
                    {aptitude}
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
      const question = quizQuestions[currentQuestion];
      if (!question) {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground mb-4">Error loading the next question.</p>
            <Button onClick={fetchQuestions}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart Quiz
            </Button>
          </div>
        );
      }
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
              {question.question}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {question.options.map((option) => (
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
            Answer a few questions to discover your aptitudes and potential career paths.
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
