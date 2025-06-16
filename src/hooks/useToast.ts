
// Consolidated toast hook - replaces both useToast and useEnhancedToast
import { toast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const showSuccess = ({ title, description }: Omit<ToastOptions, 'variant'>) => {
    toast.success(title, {
      description,
    });
  };

  const showError = ({ title, description }: Omit<ToastOptions, 'variant'>) => {
    toast.error(title, {
      description,
    });
  };

  const showInfo = ({ title, description }: Omit<ToastOptions, 'variant'>) => {
    toast(title, {
      description,
    });
  };

  const showWarning = ({ title, description }: Omit<ToastOptions, 'variant'>) => {
    toast.warning(title, {
      description,
    });
  };

  return {
    toast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

// Legacy compatibility
export const useEnhancedToast = useToast;
