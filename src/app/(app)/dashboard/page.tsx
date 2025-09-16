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
  MessageCircle,
  TrendingUp,
  Target,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WelcomeIllustration } from '@/components/illustrations/welcome';
import { CareerJourneyIllustration } from '@/components/illustrations/career-journey';
import { SuggestionsIllustration } from '@/components/illustrations/suggestions';

const quickActions = [
  {
    title: 'Career Quiz',
    description: 'Find your path',
    href: '/quiz',
    icon: ClipboardList,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Resume Scanner',
    description: 'Improve your resume',
    href: '/resume-scanner',
    icon: ScanText,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Course Suggestions',
    description: 'Get new skills',
    href: '/courses',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-700',
  },
];

const careerMatches = [
    { title: 'Frontend Developer', match: 92 },
    { title: 'UI/UX Designer', match: 88 },
    { title: 'Product Manager', match: 85 },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-8">
      {/* Welcome Banner */}
      <Card className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            👋 Welcome, Ready to plan your career journey today?
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's take the next step in your professional life.
          </p>
           <Button size="lg" className="rounded-full">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="w-64 h-64 md:w-80 md:h-80 mt-6 md:mt-0">
            <WelcomeIllustration />
        </div>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {quickActions.map((item) => (
            <Card key={item.title} className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-1.5">
                <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-6 h-6"/>
                    </div>
                </CardHeader>
                <CardContent>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Career Journey Tracker */}
        <div className="lg:col-span-2">
            <Card className="rounded-2xl shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline flex items-center gap-3">
                        <TrendingUp className="text-primary"/>
                        Your Career Journey
                    </CardTitle>
                    <CardDescription>
                        Track your progress and complete the next steps to get closer to your goal.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center gap-4">
                     <p className="text-lg font-semibold whitespace-nowrap">Profile Completion</p>
                     <Progress value={60} className="h-3" />
                     <span className="font-bold">60%</span>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1 space-y-3 p-4 border rounded-lg bg-background">
                       <h4 className="font-semibold flex items-center gap-2"><Target className="text-primary"/> Next Steps</h4>
                       <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="text-green-500" /> Complete Career Quiz</p>
                       <p className="flex items-center gap-2 text-sm text-muted-foreground"><ArrowRight className="text-primary"/> Upload & Scan Your Resume</p>
                     </div>
                     <div className="w-48 h-48 hidden sm:block">
                        <CareerJourneyIllustration />
                     </div>
                   </div>
                </CardContent>
            </Card>
        </div>
        
        {/* AI Suggestions */}
        <div className="lg:col-span-1">
            <Card className="rounded-2xl shadow-lg h-full bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline flex items-center gap-3">
                        <Lightbulb className="text-primary"/>
                        AI Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="w-40 h-40 mx-auto">
                     <SuggestionsIllustration/>
                   </div>
                   <div>
                     <h4 className="font-semibold mb-2">Top Career Matches</h4>
                     <div className="space-y-2">
                       {careerMatches.map(match => (
                         <div key={match.title} className="flex justify-between items-center text-sm p-2 rounded-md bg-background">
                           <span>{match.title}</span>
                           <Badge variant="secondary" className="bg-green-100 text-green-800">{match.match}% Match</Badge>
                         </div>
                       ))}
                     </div>
                   </div>
                   <div>
                       <h4 className="font-semibold mb-2">Recommended Course</h4>
                       <div className="p-2 rounded-md bg-background text-sm">
                           <p className="font-medium">Advanced React & State Management</p>
                           <p className="text-muted-foreground">Coursera</p>
                       </div>
                   </div>
                   <Button variant="outline" className="w-full rounded-full">Explore More</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
