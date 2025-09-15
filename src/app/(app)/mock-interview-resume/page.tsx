'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateResumeQuestions,
  type ResumeInterviewOutput,
} from '@/ai/flows/resume-interview-flow';
import { Loader2, Sparkles, Upload, FileText, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const formSchema = z.object({
  targetRole: z.string().optional(),
  resume: z
    .any()
    .refine((files) => files?.length === 1, 'Resume is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .docx, and .txt files are accepted.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function MockInterviewResumePage() {
  const [analysis, setAnalysis] = useState<ResumeInterviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetRole: '',
      resume: undefined,
    },
  });

  const fileRef = form.register('resume');

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const file = values.resume[0];
      const resumeDataUri = await readFileAsDataURL(file);

      const result = await generateResumeQuestions({
        resumeDataUri,
        targetRole: values.targetRole,
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate interview questions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Mock Interview (Resume-Based)
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your resume to get personalized interview questions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Interview Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Resume</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Button asChild variant="outline" className="w-full justify-start text-muted-foreground">
                              <div>
                                <Upload className="mr-2 h-4 w-4" />
                                {fileName || "Select a file..."}
                              </div>
                            </Button>
                            <input
                             type="file"
                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             accept={ACCEPTED_FILE_TYPES.join(',')}
                             {...fileRef}
                             onChange={(e) => {
                               if (e.target.files && e.target.files.length > 0) {
                                  setFileName(e.target.files[0].name);
                                  field.onChange(e.target.files);
                               }
                             }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Role (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Software Developer"
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
                        Analyzing Resume...
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

        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-semibold font-headline">
            Generated Questions & Keywords
          </h2>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-3/4 rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="h-4 w-5/6 rounded bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {analysis ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Keywords</CardTitle>
                  <CardDescription>
                    The AI identified these keywords from your resume.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.extractedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Personalized Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {analysis.questions.map((q, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-left font-medium">Question {index + 1}</span>
                             <Badge variant={
                               q.category === 'Technical' ? 'destructive' : q.category === 'Behavioral' ? 'default' : 'secondary'
                             } className="ml-4">{q.category}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base">
                          {q.question}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </>
          ) : (
            !isLoading && (
              <Card className="flex items-center justify-center p-8 text-center border-dashed min-h-[400px]">
                <div className="space-y-2">
                  <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload your resume to get started.
                  </p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
