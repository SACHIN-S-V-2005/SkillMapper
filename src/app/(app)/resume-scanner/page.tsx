'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Sparkles,
  Upload,
  FileText,
  ScanText,
  CheckCircle2,
  XCircle,
  Lightbulb,
  PlusCircle,
  MinusCircle,
  Star,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  analyzeResume,
  type ResumeAnalysisOutput,
} from '@/ai/flows/resume-scanner-flow';

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
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
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

export default function ResumeScannerPage() {
  const [analysis, setAnalysis] = useState<ResumeAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

      const result = await analyzeResume({
        resumeDataUri,
        targetRole: values.targetRole,
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to analyze the resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          AI Resume Scanner
        </h1>
        <p className="text-lg text-muted-foreground">
          Get instant feedback to improve your resume and land more interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
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
                        <FormLabel>Resume File</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Button
                              asChild
                              variant="outline"
                              className="w-full justify-start text-muted-foreground"
                            >
                              <div>
                                <Upload className="mr-2 h-4 w-4" />
                                {fileName || 'Select a file...'}
                              </div>
                            </Button>
                            <input
                              type="file"
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                              accept={ACCEPTED_FILE_TYPES.join(',')}
                              {...fileRef}
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
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
                            placeholder="e.g., Senior Product Manager"
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Resume
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
            Analysis Report
          </h2>
          {isLoading && (
             <div className="space-y-4">
               {[...Array(3)].map((_, i) => (
                 <Card key={i} className="animate-pulse">
                  <CardHeader><div className="h-6 w-3/4 rounded bg-muted"></div></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="h-4 w-5/6 rounded bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {analysis ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                   <div className="relative h-32 w-32 mx-auto">
                     <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                       <circle className="text-muted" strokeWidth="4" cx="18" cy="18" r="16" fill="none" />
                       <circle
                        className={`text-primary ${getScoreColor(analysis.overallScore).replace('bg-','')}`}
                        strokeWidth="4"
                        strokeDasharray={`${analysis.overallScore * 100.5 / 100}, 100.5`}
                        strokeLinecap="round"
                        cx="18" cy="18" r="16" fill="none"
                        transform="rotate(-90 18 18)"
                       />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{analysis.overallScore}</span>
                     </div>
                   </div>
                   <p className="text-muted-foreground mt-2">Based on content, formatting, and relevance.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><PlusCircle className="h-5 w-5 text-green-500" /> Present Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordAnalysis.presentKeywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><MinusCircle className="h-5 w-5 text-yellow-500" /> Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                       {analysis.keywordAnalysis.missingKeywords.length > 0 ? analysis.keywordAnalysis.missingKeywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">{keyword}</Badge>
                      )) : <p className="text-sm text-muted-foreground">No critical keywords seem to be missing. Great job!</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strengths & Improvements</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                   <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Star className="h-5 w-5 text-yellow-400" /> What You're Doing Well</h3>
                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {analysis.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-blue-500" /> Areas for Improvement</h3>
                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {analysis.areasForImprovement.map((item, i) => <li key={i}><strong>{item.area}:</strong> {item.suggestion}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle>Formatting & Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                     <h3 className="font-semibold mb-2">Formatting Analysis</h3>
                     <p className="text-muted-foreground"><strong className="text-foreground">Consistency:</strong> {analysis.formattingAnalysis.consistency}</p>
                     <p className="text-muted-foreground"><strong className="text-foreground">Readability:</strong> {analysis.formattingAnalysis.readability}</p>
                  </div>
                   <div>
                    <h3 className="font-semibold mb-2">Contact Info Check</h3>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">{analysis.contactInfoCheck.hasEmail ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} Email</span>
                        <span className="flex items-center gap-1">{analysis.contactInfoCheck.hasPhone ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} Phone</span>
                        <span className="flex items-center gap-1">{analysis.contactInfoCheck.hasLinkedIn ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} LinkedIn</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            !isLoading && (
              <Card className="flex min-h-[400px] items-center justify-center border-dashed p-8 text-center">
                <div className="space-y-2">
                  <ScanText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload your resume to get your personalized analysis.
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
