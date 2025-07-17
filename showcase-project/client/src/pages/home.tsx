import { Navigation } from "@/components/navigation";
import { Hero, QuickNavigation } from "@/components/hero";
import { WritingSection } from "@/components/writing-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <QuickNavigation />
      <WritingSection />
      <ProjectsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
