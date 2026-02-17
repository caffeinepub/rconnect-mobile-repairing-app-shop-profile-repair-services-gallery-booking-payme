import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AppErrorScreenProps {
  message?: string;
  details?: string;
}

export default function AppErrorScreen({ 
  message = 'Something went wrong', 
  details 
}: AppErrorScreenProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">{message}</CardTitle>
          <CardDescription>
            The app encountered an unexpected error. Please try reloading the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {details && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground font-mono break-words">
                {details}
              </p>
            </div>
          )}
          <Button onClick={handleReload} className="w-full" size="lg">
            Reload App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
