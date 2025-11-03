import { ReactNode } from 'react';

interface ExternalWrapperProps {
  children: ReactNode;
  className?: string;
  styles?: string; // For inline styles from external sources
}

/**
 * External Wrapper Component
 * Wraps external code (Uiverse, Codepen) for style isolation
 * Follows Open/Closed Principle
 */
function ExternalWrapper({ children, className = '', styles }: ExternalWrapperProps) {
  return (
    <>
      {styles && <style>{styles}</style>}
      <div className={className}>
        {children}
      </div>
    </>
  );
}

export default ExternalWrapper;

