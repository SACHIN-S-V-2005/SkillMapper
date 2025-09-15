'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Map, BookOpen, ExternalLink, MinusCircle, PlusCircle, Upload, Star, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

import { skillAnalysis, type SkillAnalysisOutput } from '@/ai/flows/skill-analysis-flow';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const formSchema = z.object({
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
  desiredRole: z.string().min(3, 'Please enter a valid job role.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillAnalysisPage() {
  const [analysis, setAnalysis] = useState<SkillAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: undefined,
      desiredRole: '',
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
      
      const result = await skillAnalysis({
        resumeDataUri,
        desiredRole: values.desiredRole,
      });
      setAnalysis(result);
    } catch (error) {
      console.error('Error fetching skill analysis:', error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to fetch skill analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getBadgeVariant = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    switch (level) {
      case 'Beginner': return 'secondary';
      case 'Intermediate': return 'default';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Skill & Resume Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Get a full analysis of your resume, identify skill gaps, and get a personalized roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="desiredRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Career Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Full-Stack Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" />Generate Full Analysis</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {isLoading && (
            <div className="space-y-4">
               {[...Array(4)].map((_, i) => (
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
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resume Analysis Report</CardTitle>
                  <CardDescription>An AI-powered review of your resume.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Overall Score</h3>
                         <div className={`text-6xl font-bold ${getScoreColor(analysis.resumeAnalysis.overallScore)}`}>{analysis.resumeAnalysis.overallScore}<span className="text-2xl text-muted-foreground">/100</span></div>
                        <p className="text-muted-foreground text-sm">Based on content, formatting, and relevance for '{form.getValues('desiredRole')}'.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-2"><Star className="h-5 w-5 text-yellow-400" /> What You're Doing Well</h3>
                          <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
                              {analysis.resumeAnalysis.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="h-5 w-5 text-blue-500" /> Areas for Improvement</h3>
                          <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
                              {analysis.resumeAnalysis.areasForImprovement.map((item, i) => <li key={i}><strong>{item.area}:</strong> {item.suggestion}</li>)}
                          </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Formatting & Contact Info</h3>
                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">Consistency:</strong> {analysis.resumeAnalysis.formattingAnalysis.consistency}</p>
                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">Readability:</strong> {analysis.resumeAnalysis.formattingAnalysis.readability}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm">{analysis.resumeAnalysis.contactInfoCheck.hasEmail ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} Email</span>
                            <span className="flex items-center gap-1 text-sm">{analysis.resumeAnalysis.contactInfoCheck.hasPhone ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} Phone</span>
                            <span className="flex items-center gap-1 text-sm">{analysis.resumeAnalysis.contactInfoCheck.hasLinkedIn ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />} LinkedIn</span>
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Skill Analysis</CardTitle>
                  <CardDescription>A breakdown of your skills compared to your desired role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><PlusCircle className="h-5 w-5 text-green-500" /> Your Existing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.existingSkills.map(item => (
                        <Badge key={item.skill} variant={getBadgeVariant(item.level)}>
                          {item.skill} ({item.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><MinusCircle className="h-5 w-5 text-yellow-500" /> Missing Skills for Role</h3>
                     <p className="flex flex-wrap gap-2">
                       {analysis.resumeAnalysis.keywordAnalysis.missingKeywords.length > 0 ? analysis.resumeAnalysis.keywordAnalysis.missingKeywords.map((keyword) => (
                        <Badge key={keyword} variant="outline">{keyword}</Badge>
                      )) : <span className="text-sm text-muted-foreground">No critical keywords seem to be missing. Great job!</span>}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Roadmap</CardTitle>
                  <CardDescription>A step-by-step guide to acquiring the skills you need.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                     {analysis.skillRoadmap.map((step, index) => (
                       <div key={step.step} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                              {step.step}
                            </div>
                            {index < analysis.skillRoadmap.length - 1 && <div className="w-px flex-1 bg-border" />}
                          </div>
                          <div>
                            <p className="font-semibold">{step.skill}</p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </CardContent>
              </Card>
              
               <Card>
                <CardHeader>
                  <CardTitle>Recommended Resources</CardTitle>
                  <CardDescription>Courses and links to help you learn.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {analysis.recommendedResources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                           <div>
                                <p className="font-semibold">{resource.title}</p>
                                <div className="text-sm text-muted-foreground">{resource.platform} - <Badge variant="outline">{resource.skill}</Badge></div>
                           </div>
                           <Button asChild variant="ghost" size="sm">
                                <Link href={resource.url} target="_blank">
                                    View <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                           </Button>
                        </div>
                    ))}
                </CardContent>
              </Card>
            </>
          ) : (
            !isLoading && (
              <Card className="flex items-center justify-center p-8 text-center border-dashed min-h-[400px]">
                <div className="space-y-2">
                  <Map className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Your personalized analysis will appear here.</p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
