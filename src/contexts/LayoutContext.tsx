
import React, { createContext, useContext, ReactNode } from 'react';
import { useDeviceType, DeviceInfo } from '@/hooks/useDeviceType';

interface LayoutContextType extends DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showSidebar: boolean;
  showBottomNav: boolean;
  contentPadding: string;
  navigationStyle: 'sidebar' | 'bottom' | 'header';
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const deviceInfo = useDeviceType();
  
  const layoutConfig: LayoutContextType = {
    ...deviceInfo,
    isMobile: deviceInfo.type === 'mobile',
    isTablet: deviceInfo.type === 'tablet',
    isDesktop: deviceInfo.type === 'desktop',
    showSidebar: deviceInfo.type === 'desktop',
    showBottomNav: deviceInfo.type === 'mobile',
    contentPadding: deviceInfo.type === 'mobile' ? 'p-4' : deviceInfo.type === 'tablet' ? 'p-6' : 'p-8',
    navigationStyle: deviceInfo.type === 'mobile' ? 'bottom' : deviceInfo.type === 'tablet' ? 'header' : 'sidebar'
  };

  return (
    <LayoutContext.Provider value={layoutConfig}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
