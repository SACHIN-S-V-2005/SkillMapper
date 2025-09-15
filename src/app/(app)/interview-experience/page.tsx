'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  MessageCircle,
  Bookmark,
  Plus,
  ThumbsUp,
  UserCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const placeholderExperiences = [
  {
    id: 1,
    user: 'Alex Chen',
    company: 'Innovate Inc.',
    role: 'Frontend Developer Intern',
    timestamp: '2 hours ago',
    experience:
      'The first round was a technical screening with two coding questions on LeetCode (one medium, one hard) focusing on arrays and string manipulation. The second round was a system design interview where I had to design a basic URL shortener. The final round was behavioral with a hiring manager.',
    difficulty: 'Medium',
    tags: ['DSA', 'System Design', 'React', 'Behavioral'],
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    user: 'Priya Sharma',
    company: 'Creative Solutions',
    role: 'UI/UX Designer',
    timestamp: '1 day ago',
    experience:
      "The process started with a portfolio review. Then, I had a take-home design challenge to create a wireframe and a high-fidelity mockup for a new mobile app feature. The final interview was a presentation of my design challenge to the team, followed by questions about my design process and philosophy. Everyone was super friendly!",
    difficulty: 'Easy',
    tags: ['Portfolio Review', 'Figma', 'Design Challenge', 'Presentation'],
    likes: 25,
    comments: 8,
  },
  {
    id: 3,
    user: 'Rohan Gupta',
    company: 'Numbers Co.',
    role: 'Data Analyst',
    timestamp: '3 days ago',
    experience:
      "Had 3 rounds in total. Round 1: SQL and Python coding test on HackerRank. Round 2: Technical interview diving deep into SQL window functions, probability, and a case study. Round 3: Fit interview with the Head of Analytics. Be prepared to talk about your projects in detail.",
    difficulty: 'Hard',
    tags: ['SQL', 'Python', 'Case Study', 'Probability'],
    likes: 42,
    comments: 15,
  },
];

export default function InterviewExperiencePage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Interview Experiences
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn from the real-world interview stories of others.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by company, role, or skill..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filter</Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Share Experience
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {placeholderExperiences.map((exp) => (
          <Card key={exp.id} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <UserCircle className="h-10 w-10 text-muted-foreground" />
                    <div>
                        <CardTitle className="text-lg">{exp.company} - <span className="font-normal">{exp.role}</span></CardTitle>
                        <CardDescription>
                        Posted by {exp.user} &bull; {exp.timestamp}
                        </CardDescription>
                    </div>
                 </div>
                 <Badge
                    variant={
                    exp.difficulty === 'Hard'
                        ? 'destructive'
                        : exp.difficulty === 'Medium'
                        ? 'secondary'
                        : 'default'
                    }
                    className="whitespace-nowrap"
                >
                    {exp.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{exp.experience}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex gap-4 text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{exp.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{exp.comments}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmark
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
