import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Search } from "@/components/ui/search";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Writing", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Creatives", href: "/creatives" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

import logoKLight from "@/assets/images/Vector_1752222029379.png";
import logoKDark from "@/assets/images/Layer 3_1752222033300.png";

const LogoK = () => (
  <>
    <img src={logoKDark} alt="Kaushik Srivatsan" className="w-8 h-8 dark:hidden" />
    <img src={logoKLight} alt="Kaushik Srivatsan" className="w-8 h-8 hidden dark:block" />
  </>
);

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const handleSearch = async (query: string) => {
    try {
      // Use the dedicated search endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.error('Search API error:', response.status, response.statusText);
        return [];
      }
      
      const data = await response.json();
      console.log('Search API response:', data);
      
      // Handle the search API format
      const searchResults = data.map((item: any) => ({
        id: `${item.type}-${item.id}`,
        title: item.title,
        excerpt: item.excerpt || item.description || '',
        type: item.type,
        url: `/${item.type === 'post' ? 'blog' : 'projects'}/${item.slug}`
      }));
      
      console.log('Processed search results:', searchResults);
      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50 supports-[backdrop-filter]:bg-background/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogoK />
            </div>
            <span className="font-sans font-semibold text-lg">Kaushik Srivatsan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative text-foreground/70 hover:text-foreground transition-colors group",
                  location === item.href && "text-foreground font-medium"
                )}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <Search onSearch={handleSearch} placeholder="Search content..." className="w-64" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 border-t border-border backdrop-blur-sm">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <Search onSearch={handleSearch} placeholder="Search content..." />
            
            {/* Mobile Navigation */}
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors",
                    location === item.href && "text-foreground font-medium bg-accent/30"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
