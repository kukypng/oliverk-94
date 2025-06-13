
import React, { Suspense } from 'react';
import { DashboardSkeleton, BudgetListSkeleton, FormSkeleton } from '@/components/ui/loading-states';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  type?: 'dashboard' | 'list' | 'form' | 'default';
}

const getSkeletonByType = (type: string) => {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'list':
      return <BudgetListSkeleton />;
    case 'form':
      return <FormSkeleton />;
    default:
      return <DashboardSkeleton />;
  }
};

export const LoadingBoundary = ({ 
  children, 
  fallback, 
  type = 'default' 
}: LoadingBoundaryProps) => {
  return (
    <Suspense fallback={fallback || getSkeletonByType(type)}>
      {children}
    </Suspense>
  );
};
