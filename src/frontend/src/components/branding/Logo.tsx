import { useState } from 'react';
import { SHOP_INFO } from '@/constants/shopInfo';

interface LogoProps {
  variant?: 'header' | 'hero';
  className?: string;
}

export default function Logo({ variant = 'header', className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    header: 'h-10 w-auto',
    hero: 'w-32 h-32 md:w-40 md:h-40',
  };

  if (imageError) {
    // Fallback: Show shop name with icon
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent ${
          variant === 'hero' ? 'text-6xl md:text-7xl' : 'text-2xl'
        }`}>
          R
        </div>
      </div>
    );
  }

  return (
    <img
      src="/assets/generated/rconnect-logo.dim_512x512.png"
      alt={SHOP_INFO.name}
      className={`${sizeClasses[variant]} object-contain ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
