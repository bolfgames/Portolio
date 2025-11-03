import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component - Main layout wrapper
 * Follows Single Responsibility Principle
 */
function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bolf-black">
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default Layout;

