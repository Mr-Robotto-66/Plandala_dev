import { Navbar } from './Navbar';

export const PageLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-plandala-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-plandala-muted">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
