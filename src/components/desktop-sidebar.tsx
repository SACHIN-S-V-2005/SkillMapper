import {
  Briefcase,
  ClipboardList,
  BookOpen,
  FileText,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react';

import type { NavItem } from '@/lib/types';
import { Logo } from '@/components/logo';
import { NavLink } from '@/components/nav-link';

const navItems: NavItem[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/quiz', icon: ClipboardList, label: 'Career Quiz' },
  { href: '/jobs', icon: Briefcase, label: 'Job Board' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/resume', icon: FileText, label: 'Resume Builder' },
  { href: '/interviews', icon: MessageSquare, label: 'Interviews' },
];

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r bg-card p-6 md:flex">
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
    </aside>
  );
}
