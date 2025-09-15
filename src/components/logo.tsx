import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-3 text-xl font-semibold text-foreground',
        className
      )}
    >
      <BrainCircuit className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl">
        Skill<span className="text-primary">Mapper</span>
      </span>
    </Link>
  );
}
