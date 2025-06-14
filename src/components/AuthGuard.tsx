
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/pages/AuthPage';
import { LicenseExpiredPage } from '@/pages/LicenseExpiredPage';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const { data: isLicenseValid, isLoading: licenseLoading } = useLicenseValidation();

  if (loading || licenseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Check license validity after user is authenticated
  if (isLicenseValid === false) {
    return <LicenseExpiredPage />;
  }

  return <>{children}</>;
};
