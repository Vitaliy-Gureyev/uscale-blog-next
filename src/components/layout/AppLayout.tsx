'use client'
import { useAuthState } from "@/src/hooks/useAuthState";
import { LoadingScreen } from "./LoadingScreen";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isLoading, sessionError } = useAuthState();

  return (
    <div className="min-h-screen w-full">
      {isLoading ? (
        <LoadingScreen />
      ) : sessionError ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There was an error with your session. Please try refreshing the page or logging in again.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="flex flex-col">
          <header className="w-full bg-white border-b">
            <div className="max-w-7xl mx-auto px-4">
              <a href="https://www.uscale.ai" className="inline-block py-4">
                <img
                  src="/lovable-uploads/bf6cf331-aa4d-4ec1-8496-82c967199a4b.png"
                  alt="Uscale Logo"
                  className="h-11 w-32"
                />
              </a>
            </div>
          </header>
            {children}
        </div>
      )}
    </div>
  );
};
