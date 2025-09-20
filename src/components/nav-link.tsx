'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
        isActive && 'bg-primary/10 text-primary font-semibold'
      )}
    >
      {children}
    </Link>
  );
}
