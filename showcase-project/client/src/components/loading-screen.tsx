import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check if dark theme is active
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.body.classList.contains('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(isDark);
    };

    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    console.log("Loading screen mounted"); // Debug log
    // Logo animation duration: 2.5 seconds for the larger logo
    const timer = setTimeout(() => {
      console.log("Loading screen finishing"); // Debug log
      setIsVisible(false);
      // Small delay for fade out animation
      setTimeout(onLoadingComplete, 500);
    }, 2500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [onLoadingComplete]);

  // Choose logo based on theme
  const logoSrc = isDarkTheme ? '/logo-main2.png' : '/logo-light.png';
  const fallbackSrc = '/logo-backup.png';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-400 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Logo Container */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative mb-6">
          {/* Logo Image with animations - theme-aware */}
          <img
            src={logoSrc}
            alt="Kaushik Srivatsan Logo"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 animate-logo-entrance object-contain"
            onError={(e) => {
              // Fallback to backup logo if theme logo fails
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('logo-backup.png')) {
                target.src = fallbackSrc;
              }
            }}
          />
          
          {/* Subtle breathing glow effect */}
          <div className="absolute inset-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-primary/15 animate-logo-glow" />
        </div>
        
        {/* Brand name */}
        <div className="text-lg md:text-xl font-semibold text-foreground/80 animate-pulse">
          Welcome :)
        </div>
      </div>

      {/* Loading text */}
      <div className="text-muted-foreground text-sm font-medium mb-4 animate-pulse">
        Loading...
      </div>

      {/* Minimal loading indicator */}
      <div className="flex space-x-1.5">
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
