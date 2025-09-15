
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, Sunrise, Coffee, Code, Users, Presentation, Brain, BarChart, Utensils, FileText, MessageSquare } from 'lucide-react';
import {
  generateDayInLife,
  type DayInLifeOutput,
} from '@/ai/flows/day-in-life-flow';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";


const iconMap = {
  Coffee: Coffee,
  Code: Code,
  Users: Users,
  Presentation: Presentation,
  Brain: Brain,
  BarChart: BarChart,
  Lunch: Utensils,
  FileText: FileText,
  MessageSquare: MessageSquare,
  Default: Sunrise,
};

const formSchema = z.object({
  jobRole: z.string().min(3, 'Please enter a valid job role.'),
  experienceLevel: z.enum(['Intern', 'Junior', 'Senior', 'Lead']),
});

type FormValues = z.infer<typeof formSchema>;

export default function DayInLifePage() {
  const [timeline, setTimeline] = useState<DayInLifeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      experienceLevel: 'Junior',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTimeline(null);
    try {
      const result = await generateDayInLife(values);
      setTimeline(result);
    } catch (error) {
      console.error('Error generating timeline:', error);
      let description = "Failed to generate the timeline. Please try again.";
      if (error instanceof Error && (error.message.includes('429') || error.message.toLowerCase().includes('quota'))) {
        description = "The AI service is currently busy due to high demand. Please try again in a moment.";
      }
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          A Day in the Life
        </h1>
        <p className="text-lg text-muted-foreground">
          Simulate a day in the life of a professional to see if it's the right fit for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle>Choose a Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jobRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Intern">Intern</SelectItem>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Lead">Lead</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" />Generate Day in the Life</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-2xl font-semibold font-headline">Generated Timeline</h2>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                    <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-muted"></div>
                        <div className="w-px h-full bg-muted"></div>
                    </div>
                    <div className="flex-1 space-y-2 pb-8">
                        <div className="h-5 w-1/4 rounded bg-muted"></div>
                        <div className="h-4 w-3/4 rounded bg-muted"></div>
                        <div className="h-4 w-5/6 rounded bg-muted"></div>
                    </div>
                </div>
              ))}
            </div>
          )}

          {timeline && timeline.timeline.length > 0 && (
             <div className="space-y-2">
                {timeline.timeline.map((item, index) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap.Default;
                    return (
                       <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                {index < timeline.timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                            </div>
                            <div className={`pb-8 ${index === timeline.timeline.length - 1 ? 'pb-0' : ''}`}>
                                <p className="text-sm font-medium text-muted-foreground">{item.time}</p>
                                <p className="font-semibold text-lg">{item.title}</p>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                       </div>
                    );
                })}
            </div>
          )}

          {!isLoading && !timeline && (
            <Card className="flex items-center justify-center p-8 text-center border-dashed min-h-[400px]">
              <div className="space-y-2">
                <Sunrise className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your generated "Day in the Life" will appear here.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
