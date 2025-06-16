
import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        width: 1920,
        height: 1080,
        isTouchDevice: false,
        orientation: 'landscape'
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      type: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
      width,
      height,
      isTouchDevice: 'ontouchstart' in window,
      orientation: width > height ? 'landscape' : 'portrait'
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo({
        type: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
        width,
        height,
        isTouchDevice: 'ontouchstart' in window,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};
