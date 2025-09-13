'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InterviewExperiencePage() {
  return (
    <div className="container mx-auto">
       <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Interview Experience
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn from the interview experiences of others.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is currently under development.</p>
        </CardContent>
      </Card>
    </div>
  )
}
