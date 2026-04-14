import React, { useState, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let message = "Something went wrong.";
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.operationType) {
        message = `Firestore ${parsed.operationType} error: ${parsed.error}. Please check permissions.`;
      }
    } catch {
      message = error?.message || message;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6 text-center">
        <div className="glass-card p-8 max-w-md border-red-500/20">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Application Error</h2>
          <p className="text-white/60 mb-6">{message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
