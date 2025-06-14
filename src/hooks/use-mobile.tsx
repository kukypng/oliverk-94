
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize state synchronously if window is available
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    // Default for environments where window is not defined (e.g., SSR, though less relevant for Vite CSR)
    return false; 
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Ensure the state is correct when the component mounts or breakpoint changes,
    // covering cases where window size might have changed before effect runs.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT); 
    return () => mql.removeEventListener("change", onChange)
  }, []) // MOBILE_BREAKPOINT is a constant, so not needed in deps.

  return isMobile; // Directly return boolean
}

