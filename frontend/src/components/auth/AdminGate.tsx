import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useAuth';
import { useActor } from '@/hooks/useActor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import LoginButton from './LoginButton';
import { useNavigate } from '@tanstack/react-router';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: isCheckingAdmin, isFetched } = useIsCallerAdmin();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Show loading state while initializing or checking authentication
  // Wait for actor to be ready and admin check to complete
  if (isInitializing || actorFetching || (isAuthenticated && !isFetched)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-amber-600" />
            <p className="text-muted-foreground">Verifying access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please log in to access the bookings management area
              </p>
            </div>
            <div className="space-y-3">
              <LoginButton />
              <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if authenticated but not admin
  if (isAuthenticated && isFetched && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">
                You don't have permission to access this area. This section is only available to shop administrators.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate({ to: '/' })} className="w-full">
                Back to Home
              </Button>
              <LoginButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is admin, show the protected content
  return <>{children}</>;
}
