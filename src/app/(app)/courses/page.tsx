'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  suggestCourses,
  type AICourseSuggestionOutput,
} from '@/ai/flows/ai-course-suggestion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  userProfile: z.string().min(50, 'Please provide a more detailed profile.'),
  careerGoals: z.string().min(20, 'Please describe your career goals in more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CoursesPage() {
  const [recommendations, setRecommendations] = useState<AICourseSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      careerGoals: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await suggestCourses(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Error fetching course recommendations:', error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to fetch course recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          AI Course Recommender
        </h1>
        <p className="text-lg text-muted-foreground">
          Tell us about yourself and your goals, and our AI will find the perfect courses for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Profile & Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skills, Experience, and Background</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I am a recent computer science graduate with experience in Python and JavaScript. I've completed a few personal projects, including a simple e-commerce website...' "
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
                  name="careerGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Desired Career Path</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I want to become a full-stack developer, specializing in the MERN stack. I'm also interested in cloud technologies like AWS.' "
                          className="min-h-[80px]"
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
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold font-headline">Recommendations</h2>
          {isLoading && (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/4 rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="mt-2 h-4 w-5/6 rounded bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {recommendations && recommendations.courseRecommendations.map((course, index) => (
             <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge variant={course.relevanceScore > 0.8 ? 'default' : 'secondary'} className="bg-accent text-accent-foreground whitespace-nowrap">
                    Score: {Math.round(course.relevanceScore * 100)}
                  </Badge>
                </div>
                <CardDescription>{course.platform}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{course.reasoning}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={course.url} target="_blank">
                    View Course <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {!isLoading && !recommendations && (
             <Card className="flex items-center justify-center p-8 text-center border-dashed">
              <div className="space-y-2">
                  <p className="text-muted-foreground">Your course recommendations will appear here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
