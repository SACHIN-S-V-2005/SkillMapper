'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  suggestProjects,
  type ProjectSuggestionOutput,
} from '@/ai/flows/project-suggestion-flow';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';

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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
  jobRole: z.string().min(3, 'Please enter a valid job role.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<ProjectSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestProjects(values);
      setSuggestions(result);
    } catch (error) {
      console.error('Error fetching project suggestions:', error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to fetch project suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Project Suggestions
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter a job role to get AI-powered project ideas for your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
         <div className="lg:col-span-1">
             <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Define Your Goal</CardTitle>
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
                            <Input placeholder="e.g., Data Scientist" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Ideas...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Suggest Projects
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
        </div>


        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold font-headline">Your Project Ideas</h2>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                 <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-5 w-3/4 rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full rounded bg-muted mb-2"></div>
                    <div className="h-4 w-5/6 rounded bg-muted"></div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        <div className="h-6 w-20 rounded-full bg-muted"></div>
                        <div className="h-6 w-24 rounded-full bg-muted"></div>
                        <div className="h-6 w-16 rounded-full bg-muted"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {suggestions && suggestions.projects.map((project, index) => (
             <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                 <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                 </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && !suggestions && (
             <Card className="flex items-center justify-center p-8 text-center border-dashed min-h-[400px]">
              <div className="space-y-2">
                  <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Your project ideas will appear here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
