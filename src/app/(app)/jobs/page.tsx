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
import { placeholderJobs } from '@/lib/data';
import { ExternalLink, Search, Building } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Job Searching
        </h1>
        <p className="text-lg text-muted-foreground">
          Find your next career opportunity in India.
        </p>
      </div>

      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for jobs..." className="pl-10" />
        </div>
        <Button>Search</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {placeholderJobs.map(job => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 pt-1">
                <span>{job.company}</span>
                <span className="text-xs">&bull;</span>
                <span>{job.location}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>
            </CardContent>
            <CardFooter>
              <div className="grid w-full grid-cols-2 gap-2">
                 <Button asChild size="sm" variant="outline">
                  <Link
                    href={job.companyUrl}
                    target="_blank"
                  >
                    Company Website <Building className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}&location=India`}
                    target="_blank"
                  >
                    LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                 <Button asChild size="sm" variant="outline">
                  <Link
                    href={`https://www.naukri.com/jobs-in-india?k=${encodeURIComponent(job.title)}`}
                    target="_blank"
                  >
                    Naukri <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                 <Button asChild size="sm" variant="outline">
                  <Link
                    href={`https://in.indeed.com/jobs?q=${encodeURIComponent(job.title)}&l=India`}
                    target="_blank"
                  >
                    Indeed <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                 <Button asChild size="sm" variant="outline">
                  <Link
                    href={`https://unstop.com/jobs?opportunity_type=jobs&searchTerm=${encodeURIComponent(job.title)}`}
                    target="_blank"
                  >
                    Unstop <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
