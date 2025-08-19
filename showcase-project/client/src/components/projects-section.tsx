import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

// The Project interface remains the same
interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  status: string;
  link?: string;
  github?: string;
  featured: boolean;
  cover?: string;
  createdAt: string;
  updatedAt: string;
}

export function ProjectsSection() {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  if (isLoading) {
    return (
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 gradient-text">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tools and experiments in AI, knowledge management, and human creativity
            </p>
          </div>
          <div className="space-y-32">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse min-h-[60vh] flex items-center">
                <div className="w-full max-w-6xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                      <div className="h-12 bg-muted/30 rounded-lg w-3/4" />
                      <div className="space-y-3">
                        <div className="h-4 bg-muted/30 rounded w-full" />
                        <div className="h-4 bg-muted/30 rounded w-5/6" />
                        <div className="h-4 bg-muted/30 rounded w-4/6" />
                      </div>
                    </div>
                    <div className="aspect-[4/3] bg-muted/30 rounded-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 gradient-text">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tools and experiments in AI, knowledge management, and human creativity
          </p>
        </div>

        <div className="space-y-32">
          {projects.slice(0, 4).map((project: Project, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="text-center mt-32">
          <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ProjectCard component with full-screen focused layout
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const getImageUrl = (coverPath?: string): string | undefined => {
    if (!coverPath) {
      return undefined;
    }
    // If it's already a full URL, return it as is
    if (coverPath.startsWith('http://') || coverPath.startsWith('https://')) {
      return coverPath;
    }
    // For local/relative paths, ensure it starts with a '/' to point to the public root
    return coverPath.startsWith('/') ? coverPath : `/${coverPath}`;
  };

  const imageUrl = getImageUrl(project.cover);

  return (
    <div className="min-h-[60vh] flex items-center group">
      <div className="w-full max-w-6xl mx-auto">
        <Link href={`/projects/${project.slug}`}>
          <div className="grid lg:grid-cols-2 gap-16 items-center cursor-pointer transition-all duration-700 ease-out hover:scale-[1.02] hover:opacity-95">
            {/* Content Section - Always on Left */}
            <div className="space-y-8 lg:pr-8">
              <div className="space-y-6">
                <h3 className="font-sans font-bold text-3xl lg:text-4xl text-foreground transition-all duration-500 group-hover:text-primary leading-tight">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-prose">
                    {project.description}
                  </p>
                )}
              </div>
              
              {/* Subtle indicator */}
              <div className="flex items-center text-primary/60 text-sm font-medium">
                <span>Explore Project</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
            
            {/* Image Section - Always on Right */}
            <div className="order-first lg:order-last">
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/20 shadow-2xl shadow-primary/5">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/40">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
