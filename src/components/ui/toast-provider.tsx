
import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export const ToastProvider = () => {
  const { theme } = useTheme();
  
  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
    />
  );
};
