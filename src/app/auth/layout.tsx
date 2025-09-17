
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30">
      <div className='mb-6'>
        <Logo />
      </div>
      <div className="w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}
