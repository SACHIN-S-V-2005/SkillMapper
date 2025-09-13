'use client';
import {
  Briefcase,
  ClipboardList,
  BookOpen,
  FileText,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { NavLink } from '@/components/nav-link';
import type { NavItem } from '@/lib/types';

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/quiz', icon: ClipboardList, label: 'Career Quiz' },
  { href: '/jobs', icon: Briefcase, label: 'Job Board' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/resume', icon: FileText, label: 'Resume Builder' },
  { href: '/interviews', icon: MessageSquare, label: 'Interviews' },
];

export function MobileNav() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
