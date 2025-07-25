import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

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

export default function ProjectPage() {
  const [match, params] = useRoute("/projects/:slug");
  const slug = params?.slug;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["project", slug],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${slug}`);
      if (!response.ok) {
        throw new Error("Project not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-4xl py-8 pt-20">
        <div className="mb-8">
          <Link href="/projects">
            <Button variant="outline" size="sm" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          
          {/* Cover Image */}
          {project.cover && (
            <div className="relative h-64 mb-8 overflow-hidden rounded-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${project.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-white/20 text-white border-white/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Tags (if no cover image) */}
          {!project.cover && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <time dateTime={project.createdAt}>
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {project.status && (
              <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                {project.status}
              </Badge>
            )}
          </div>
          
          {project.description && (
            <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
          )}
          
          <div className="flex gap-4 mb-8">
            {project.link && (
              <Button asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Project
                </a>
              </Button>
            )}
            {project.github && (
              <Button variant="outline" asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>
          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </div>
        </div>
        
      </div>
      
      <Footer />
    </div>
  );
}
