'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsOutput,
} from '@/ai/flows/mock-interview-tool';

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
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  jobRole: z.string().min(3, 'Job role is required.'),
  userSkills: z.string().min(5, 'Please list at least one skill.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InterviewsPage() {
  const [questions, setQuestions] = useState<GenerateInterviewQuestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      userSkills: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setQuestions(null);
    try {
      const skillsArray = values.userSkills.split(',').map(skill => skill.trim());
      const result = await generateInterviewQuestions({
        jobRole: values.jobRole,
        userSkills: skillsArray,
      });
      setQuestions(result);
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

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Mock Interview Tool
        </h1>
        <p className="text-lg text-muted-foreground">
          Prepare for your next interview with AI-generated questions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Interview Setup</CardTitle>
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
           <h2 className="text-2xl font-semibold font-headline">Your Questions</h2>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse rounded-md border p-4">
                    <div className="h-5 w-full rounded bg-muted"></div>
                </div>
              ))}
            </div>
          )}

          {questions && questions.questions.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {questions.questions.map((q, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                     <span className="font-medium">Question {index + 1}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base pt-2">
                    {q}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

           {!isLoading && !questions && (
             <Card className="flex items-center justify-center p-8 text-center border-dashed">
              <div className="space-y-2">
                  <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Your interview questions will appear here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
