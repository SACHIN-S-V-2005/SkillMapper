'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsOutput,
} from '@/ai/flows/mock-interview-tool';
import {
  generateFeedback,
  type FeedbackOutput,
} from '@/ai/flows/feedback-flow';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Loader2, Sparkles, Mic, StopCircle, RefreshCw, MessageSquare, CornerDownLeft, SparklesIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { InterviewerIllustration } from '@/components/illustrations/interviewer';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  jobRole: z.string().min(3, 'Job role is required.'),
  userSkills: z.string().min(3, 'Please list at least one skill.'),
});

type FormValues = z.infer<typeof formSchema>;
type InterviewQuestion = { question: string; answer: string };

export default function InterviewsPage() {
  const [interviewData, setInterviewData] = useState<InterviewQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackOutput | null>(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { toast } = useToast();
  const { transcript, isListening, hasRecognitionSupport, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: 'Frontend Developer',
      userSkills: 'React, TypeScript, Next.js',
    },
  });

  const currentQuestion = interviewData?.[currentQuestionIndex];

  useEffect(() => {
    if (!isListening && transcript && currentQuestion) {
      handleGetFeedback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setInterviewData(null);
    setCurrentQuestionIndex(0);
    setFeedback(null);
    resetTranscript();

    try {
      const skillsArray = values.userSkills.split(',').map(skill => skill.trim());
      const result = await generateInterviewQuestions({
        jobRole: values.jobRole,
        userSkills: skillsArray,
      });
      if (result.interviews.length === 0) {
        toast({
            variant: "destructive",
            title: "No Questions Generated",
            description: "The AI couldn't generate questions for the given role and skills. Please try again with different inputs.",
        });
      }
      setInterviewData(result.interviews);
    } catch (error) {
      console.error('Error generating questions:', error);
       toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate interview questions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGetFeedback() {
    if (!currentQuestion) return;
    setIsGettingFeedback(true);
    setFeedback(null);
    try {
        const result = await generateFeedback({
            question: currentQuestion.question,
            answer: transcript,
        });
        setFeedback(result);
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Feedback Error",
            description: "Could not get feedback for your answer.",
        });
    } finally {
        setIsGettingFeedback(false);
    }
  }

  const handleNextQuestion = () => {
    if (interviewData && currentQuestionIndex < interviewData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        resetTranscript();
        setFeedback(null);
    }
  };

  const restartInterview = () => {
    setInterviewData(null);
    setCurrentQuestionIndex(0);
    setFeedback(null);
    resetTranscript();
  };

  if (!isClient) {
    return (
        <div className="container mx-auto flex items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!hasRecognitionSupport) {
      return (
        <div className="container mx-auto flex items-center justify-center h-full">
            <Card className="max-w-md text-center p-8">
                <CardTitle>Browser Not Supported</CardTitle>
                <CardDescription>
                    This browser does not support speech recognition. Please use Google Chrome for the best experience.
                </CardDescription>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Live Mock Interview
        </h1>
        <p className="text-lg text-muted-foreground">
          Practice your interview skills with a live AI interviewer.
        </p>
      </div>

     { !interviewData ? (
        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Interview Setup</CardTitle>
              <CardDescription>Enter your target role and skills to start the interview.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jobRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Skills (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., React, TypeScript, GraphQL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Interview...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Start Interview</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Interviewer</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                        <div className="w-48 h-48">
                            <InterviewerIllustration isListening={isListening} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={restartInterview} variant="outline" className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Restart Interview
                        </Button>
                         <Button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex >= interviewData.length - 1}
                            className="w-full"
                          >
                           Next Question <CornerDownLeft className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 space-y-6">
                <Card className="min-h-[150px]">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-3"><MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> Question {currentQuestionIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium">{currentQuestion?.question}</p>
                    </CardContent>
                </Card>
                
                <Card className="min-h-[200px]">
                     <CardHeader>
                        <CardTitle>Your Answer</CardTitle>
                        <CardDescription>Click the button below and start speaking.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center mb-4">
                            <Button
                                size="icon"
                                className={cn("rounded-full h-16 w-16", isListening && "bg-red-500 hover:bg-red-600")}
                                onClick={isListening ? stopListening : startListening}
                            >
                                {isListening ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                            </Button>
                        </div>
                        {transcript && <p className="text-muted-foreground italic">"{transcript}"</p>}
                        {!transcript && isListening && <p className="text-muted-foreground text-center">Listening...</p>}
                    </CardContent>
                </Card>

                 <Card className="min-h-[150px]">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-3"><SparklesIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> AI Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isGettingFeedback && <Loader2 className="h-6 w-6 animate-spin" />}
                        {feedback && (
                            <p className="text-muted-foreground">{feedback.feedback}</p>
                        )}
                        {!feedback && !isGettingFeedback && <p className="text-muted-foreground">Your feedback will appear here after you answer.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
