import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Button Component - Reusable button with variants
 * Follows Single Responsibility and Open/Closed Principles
 */
function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-bolf-neon-blue to-bolf-orange text-bolf-white hover:opacity-90 hover:shadow-lg hover:shadow-bolf-neon-blue/50',
    secondary: 'bg-transparent border-2 border-bolf-neon-blue text-bolf-neon-blue hover:bg-bolf-neon-blue hover:text-bolf-black',
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default Button;

