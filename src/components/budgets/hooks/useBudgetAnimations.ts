
import { useCallback, useMemo } from 'react';

export const useBudgetAnimations = (filteredBudgets: any[] = []) => {
  const getStaggerDelay = useCallback((index: number) => {
    return `${index * 50}ms`;
  }, []);

  const getCardAnimationClass = useCallback((index: number) => {
    return `animate-fade-in hover:animate-scale-in`;
  }, []);

  const getListAnimationClass = useCallback(() => {
    return 'animate-fade-in';
  }, []);

  const getDeleteAnimationClass = useCallback(() => {
    return 'animate-fade-out animate-scale-out';
  }, []);

  const getLoadingAnimationClass = useCallback(() => {
    return 'animate-pulse';
  }, []);

  const animationConfig = useMemo(() => ({
    staggerChildren: 50,
    duration: 300,
    easing: 'ease-out',
    reducedMotion: false // Can be configured based on user preference
  }), []);

  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.98
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
