
import { toast } from 'sonner';

interface ToastOptions {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showSuccess = (options: ToastOptions) => {
    toast.success(options.title, {
      description: options.description,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  };

  const showError = (options: ToastOptions) => {
    toast.error(options.title, {
      description: options.description,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  };

  const showWarning = (options: ToastOptions) => {
    toast.warning(options.title, {
      description: options.description,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  };

  const showInfo = (options: ToastOptions) => {
    toast.info(options.title, {
      description: options.description,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
