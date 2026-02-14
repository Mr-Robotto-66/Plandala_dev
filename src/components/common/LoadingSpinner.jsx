import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-plandala-cyan-400" />
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-plandala-muted">Loading...</p>
    </div>
  );
};
