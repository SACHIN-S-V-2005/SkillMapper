'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Wand2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type QuizQuestion = GenerateQuizQuestionsOutput['questions'][0];

const fallbackQuestions: QuizQuestion[] = [
    {
      "question": "Which of the following is a key skill for a Data Analyst?",
      "options": ["Video Editing", "SQL", "Graphic Design", "Creative Writing"],
      "answer": "SQL"
    },
    {
      "question": "What does 'UI' stand for in 'UI/UX Design'?",
      "options": ["User Interaction", "User Interface", "Universal Integration", "User Identity"],
      "answer": "User Interface"
    },
    {
      "question": "If a project is delayed, what is the first thing a Project Manager should do?",
      "options": ["Blame the team", "Ignore the delay", "Communicate with stakeholders", "Extend the deadline silently"],
      "answer": "Communicate with stakeholders"
    },
    {
      "question": "Which programming language is most commonly used for web frontend development?",
      "options": ["Python", "Java", "JavaScript", "C++"],
      "answer": "JavaScript"
    },
    {
      "question": "What is the primary goal of a marketing campaign?",
      "options": ["To win design awards", "To increase brand awareness and sales", "To hire new employees", "To develop new software"],
      "answer": "To increase brand awareness and sales"
    }
];


export default function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);

    try {
      const result = await generateQuizQuestions();
      setQuizQuestions(result.questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        title: "Using Fallback Quiz",
        description: "⚡ Our AI is currently busy due to high demand. Please enjoy this sample quiz.",
      });
      setQuizQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    setSelectedAnswer(answer);
    if (answer === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setQuizCompleted(true);
        }
    }, 1500); // Wait 1.5 seconds before moving to next question
  };


  const progress = quizQuestions.length > 0 ? ((currentQuestion + 1) / quizQuestions.length) * 100 : 0;

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
            <div className="text-center">
              <Wand2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Quiz Complete!</h3>
              <p className="mt-2 text-muted-foreground">
                You scored {score} out of {quizQuestions.length}.
              </p>
               <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => fetchQuestions()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Take Another Quiz
                  </Button>
              </div>
            </div>
        </motion.div>
      )
    }

    if (quizQuestions.length > 0) {
      const question = quizQuestions[currentQuestion];
      if (!question) {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground mb-4">Error loading the next question.</p>
            <Button onClick={() => fetchQuestions()}>
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
          className="w-full"
        >
          <div className="mb-6 space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-lg font-medium text-center">
              {question.question}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = question.answer === option;

                return (
                  <Button
                    key={option}
                    variant="outline"
                    className={cn(
                        "h-auto min-h-[4rem] justify-start whitespace-normal text-left transition-all duration-300",
                        selectedAnswer && isCorrect && "bg-green-100 border-green-300 text-green-800 hover:bg-green-100",
                        selectedAnswer && !isCorrect && isSelected && "bg-red-100 border-red-300 text-red-800 hover:bg-red-100"
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                  >
                    <div className="flex-1">{option}</div>
                    {selectedAnswer && isCorrect && isSelected && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {selectedAnswer && !isCorrect && isSelected && <XCircle className="h-5 w-5 text-red-600" />}
                    {selectedAnswer && isCorrect && !isSelected && <CheckCircle className="h-5 w-5 text-green-600 opacity-50" />}
                  </Button>
                )
            })}
          </div>
        </motion.div>
      )
    }

    return (
       <div className="flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground mb-4">Could not load quiz questions.</p>
            <Button onClick={() => fetchQuestions()}>
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
            Test your knowledge and find out where you stand.
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
