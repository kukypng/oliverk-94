
import { toast } from 'sonner';

export interface EnhancedToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

export const useEnhancedToast = () => {
  const showSuccess = (options: EnhancedToastOptions) => {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      style: options.style,
    });
  };

  const showError = (options: EnhancedToastOptions) => {
    console.error('Toast Error:', options.title, options.description);
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 6000,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      style: options.style,
    });
  };

  const showWarning = (options: EnhancedToastOptions) => {
    console.warn('Toast Warning:', options.title, options.description);
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      style: options.style,
    });
  };

  const showInfo = (options: EnhancedToastOptions) => {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      onDismiss: options.onDismiss,
      style: options.style,
    });
  };

  const showLoading = (title: string, promise: Promise<any>) => {
    return toast.promise(promise, {
      loading: title,
      success: 'Operação concluída com sucesso!',
      error: (err) => {
        console.error('Promise Toast Error:', err);
        return 'Ocorreu um erro durante a operação';
      },
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};
