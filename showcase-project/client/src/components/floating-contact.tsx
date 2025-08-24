import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingContactProps {
  scrollThreshold?: number;
}

export function FloatingContact({ scrollThreshold = 500 }: FloatingContactProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const scrollToContact = () => {
    const contactSection = document.querySelector('section:has(h2:contains("Let\'s Connect"))');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback to contact page if section not found
      window.location.href = '/contact';
    }
    setIsExpanded(false);
  };

  const directEmail = () => {
    window.location.href = 'mailto:kaushiksrivatsan03@gmail.com';
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-background border border-border rounded-lg shadow-lg p-2 space-y-2 min-w-48">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium">Get in touch</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToContact}
            className="w-full justify-start text-sm"
          >
            Send a message
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={directEmail}
            className="w-full justify-start text-sm"
          >
            Email directly
          </Button>
        </div>
      )}

      {/* Main button */}
      <Button
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          isExpanded && "rotate-180"
        )}
        aria-label="Contact options"
      >
        {isExpanded ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
