'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Map, BookOpen, ExternalLink, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { skillAnalysis, type SkillAnalysisOutput } from '@/ai/flows/skill-analysis-flow';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  userSkills: z.string().min(10, 'Please list some of your skills.'),
  desiredRole: z.string().min(3, 'Please enter a valid job role.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillAnalysisPage() {
  const [analysis, setAnalysis] = useState<SkillAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSkills: '',
      desiredRole: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const skillsArray = values.userSkills.split(',').map(skill => skill.trim());
      const result = await skillAnalysis({
        userSkills: skillsArray,
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

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Skill Analysis & Roadmap
        </h1>
        <p className="text-lg text-muted-foreground">
          Analyze your skills, identify gaps, and get a personalized roadmap to your dream job.
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
                    name="userSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Skills (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Python, React, SQL, Data Analysis"
                            className="min-h-[120px]"
                            {...field}
                          />
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
                      <><Sparkles className="mr-2 h-4 w-4" />Generate Roadmap</>
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
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Your Skill Analysis</CardTitle>
                  <CardDescription>A breakdown of your current skills and identified gaps.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Existing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.existingSkills.map(item => (
                        <Badge key={item.skill} variant={getBadgeVariant(item.level)}>
                          {item.skill} ({item.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold mb-2">Missing Skills</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {analysis.missingSkills.map((item, index) => (
                         <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                               <MinusCircle className="h-4 w-4 text-destructive" />
                               <span className="font-medium">{item.skill}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>{item.reasoning}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
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
                     {analysis.skillRoadmap.map((step) => (
                       <div key={step.step} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                              {step.step}
                            </div>
                            {step.step < analysis.skillRoadmap.length && <div className="w-px h-full bg-border" />}
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
                  <p className="text-muted-foreground">Your personalized skill analysis and roadmap will appear here.</p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
