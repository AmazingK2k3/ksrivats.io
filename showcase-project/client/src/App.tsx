import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/loading-screen";
import PageTransition from "@/components/page-transition";
import Home from "@/pages/home";
// Import assets to ensure they're processed by Vite
import "@/lib/assets";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Projects from "@/pages/projects";
import ProjectPage from "@/pages/project-page";
import Creatives from "@/pages/creatives";
import CreativePage from "@/pages/creative-page";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <PageTransition className="animate-page-entrance">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:slug" component={ProjectPage} />
        <Route path="/creatives" component={Creatives} />
        <Route path="/creatives/:slug" component={CreativePage} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // For debugging - always show loading screen
    // Comment out session storage check temporarily
    // const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
    
    // if (hasSeenLoading) {
    //   // Skip loading screen for subsequent navigations in the same session
    //   setIsLoading(false);
    //   setShowContent(true);
    // }
  }, []);

  const handleLoadingComplete = () => {
    // sessionStorage.setItem("hasSeenLoading", "true");
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
        <TooltipProvider>
          <Toaster />
          {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
          {showContent && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
