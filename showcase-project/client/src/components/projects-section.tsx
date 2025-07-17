import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ExternalLink, Github, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground">
              Tools and experiments in AI, knowledge management, and human creativity
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-16 w-16 bg-muted rounded-2xl mb-6" />
                  <div className="h-6 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded mb-6" />
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 w-16 bg-muted rounded-full" />
                    <div className="h-6 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground">
            Tools and experiments in AI, knowledge management, and human creativity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="h-12 px-8">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "archived":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "current":
        return <Sparkles className="w-4 h-4" />;
      case "completed":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        {project.cover ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-gradient-to-br from-primary/10 to-accent/10"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${project.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        )}
        <div className="absolute top-4 right-4">
          {project.status && (
            <Badge
              variant="outline"
              className={`${getStatusColor(project.status)} capitalize backdrop-blur-sm`}
            >
              {getStatusIcon(project.status)}
              <span className="ml-1">{project.status}</span>
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-sans font-bold text-xl mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
          {project.description}
        </p>

        {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium text-sm"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                title="View Project"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                title="View Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
