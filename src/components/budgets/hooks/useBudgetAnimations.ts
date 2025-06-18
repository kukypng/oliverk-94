
import { useCallback, useMemo } from 'react';

export const useBudgetAnimations = (filteredBudgets: any[] = []) => {
  const getStaggerDelay = useCallback((index: number) => {
    // Reduzir delay para animações mais rápidas
    return Math.min(index * 30, 300); // Max 300ms delay
  }, []);

  const getCardAnimationClass = useCallback((index: number) => {
    // Simplificar animações para melhor performance
    return 'animate-fade-in';
  }, []);

  const getListAnimationClass = useCallback(() => {
    return 'animate-fade-in';
  }, []);

  const getDeleteAnimationClass = useCallback(() => {
    return 'animate-scale-out';
  }, []);

  const getLoadingAnimationClass = useCallback(() => {
    return 'animate-pulse';
  }, []);

  const animationConfig = useMemo(() => ({
    staggerChildren: 30, // Reduzido de 50ms para 30ms
    duration: 200, // Reduzido de 300ms para 200ms
    easing: 'ease-out',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 10, // Reduzido de 20px para 10px
      scale: 0.98 // Reduzido de 0.95 para 0.98
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: Math.min(index * 0.03, 0.3), // Reduzido delay máximo
        duration: 0.2, // Reduzido de 0.3s para 0.2s
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.01, // Reduzido de 1.02 para 1.01
      y: -2, // Reduzido de -4px para -2px
      transition: {
        duration: 0.15, // Reduzido de 0.2s para 0.15s
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.99 // Reduzido de 0.98 para 0.99
    }
  }), []);

  return {
    getStaggerDelay,
    getCardAnimationClass,
    getListAnimationClass,
    getDeleteAnimationClass,
    getLoadingAnimationClass,
    animationConfig,
    cardVariants
  };
};
