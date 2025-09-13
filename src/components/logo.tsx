import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2 text-xl font-semibold text-foreground',
        className
      )}
    >
      <BrainCircuit className="h-7 w-7 text-primary" />
      <span className="font-headline">
        Skill<span className="text-primary">Mapper</span>
      </span>
    </Link>
  );
}
