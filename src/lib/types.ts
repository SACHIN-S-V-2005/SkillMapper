export type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export type DashboardCardItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  imageId: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
};

export type QuizQuestion = {
  question: string;
  options: { text: string; skill: string }[];
};
