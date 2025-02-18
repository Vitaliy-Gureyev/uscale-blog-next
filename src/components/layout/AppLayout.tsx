'use client'

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {

  return (
    <div className="min-h-screen w-full">
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
    </div>
  );
};
