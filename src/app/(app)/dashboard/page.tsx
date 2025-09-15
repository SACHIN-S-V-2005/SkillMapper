import {
  Briefcase,
  ClipboardList,
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Search,
  Map,
  Sunrise,
  Lightbulb,
  ScanText,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { DashboardCardItem } from '@/lib/types';

const cardItems: DashboardCardItem[] = [
  {
    title: 'Career Quiz',
    description: 'Discover your interests and aptitudes to find the perfect career path.',
    href: '/quiz',
    icon: ClipboardList,
    imageId: 'quiz',
  },
  {
    title: 'Job Searching',
    description: 'Explore job postings from top companies based on your skills.',
    href: '/jobs',
    icon: Search,
    imageId: 'jobs',
  },
  {
    title: 'Course Recommender',
    description: 'Get personalized course suggestions to achieve your career goals.',
    href: '/courses',
    icon: BookOpen,
    imageId: 'courses',
  },
  {
    title: 'Resume Builder',
    description: 'Craft a professional resume that highlights your skills and experience.',
    href: '/resume',
    icon: FileText,
    imageId: 'resume',
  },
  {
    title: 'Mock Interview (Skills)',
    description: 'Practice with AI-generated questions for your target job roles.',
    href: '/interviews',
    icon: MessageSquare,
    imageId: 'interviews',
  },
  {
    title: 'Mock Interview (Resume)',
    description: 'Get interview questions based on your resume.',
    href: '/mock-interview-resume',
    icon: MessageSquare,
    imageId: 'mock-interview-resume',
  },
  {
    title: 'Skill & Resume Analysis',
    description: 'Get a roadmap to enhance your skills and improve your resume.',
    href: '/skill-analysis',
    icon: Map,
    imageId: 'skill-analysis',
  },
  {
    title: 'Day in the Life',
    description: 'Simulate a day in the life of a professional.',
    href: '/day-in-life',
    icon: Sunrise,
    imageId: 'day-in-life',
  },
  {
    title: 'Project Suggestions',
    description: 'Receive project ideas to build your portfolio.',
    href: '/project-suggestions',
    icon: Lightbulb,
    imageId: 'project-suggestions',
  },
  {
    title: 'Interview Experience',
    description: 'Learn from the interview experiences of others.',
    href: '/interview-experience',
    icon: MessageCircle,
    imageId: 'interview-experience',
  },
];

function getImage(id: string) {
  return PlaceHolderImages.find(img => img.id === id);
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Welcome to SkillMapper
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized AI-powered career and skills advisor.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cardItems.map((item) => {
          const image = getImage(item.imageId);
          return (
            <Card key={item.title} className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              {image && (
                 <div className="relative h-48 w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                 </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <item.icon className="h-6 w-6 text-primary" />
                  <span>{item.title}</span>
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={item.href}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
