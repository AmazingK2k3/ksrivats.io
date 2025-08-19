import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github, Lightbulb, Calendar, Search, Filter, Tag } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { format } from "date-fns";

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

// Simple and clean grid layout
function FlexibleProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          size="medium"
        />
      ))}
    </div>
  );
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Extract unique tags and statuses
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const statuses = useMemo(() => {
    const statusSet = new Set<string>();
    projects.forEach(project => {
      if (project.status) statusSet.add(project.status);
    });
    return Array.from(statusSet).sort();
  }, [projects]);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;

      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => project.tags?.includes(tag));

      return matchesSearch && matchesStatus && matchesTags;
    });
  }, [projects, searchQuery, selectedStatus, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
                Projects & Experiments
              </h1>
              <p className="text-xl text-muted-foreground">
                Building tools and exploring ideas at the intersection of AI, creativity, and human intelligence
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
              Projects & Experiments
            </h1>
            <p className="text-xl text-muted-foreground">
              Building tools and exploring ideas at the intersection of AI, creativity, and human intelligence
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All Projects
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTags.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTags([])}
              >
                All Tags
              </Button>
              {allTags.slice(0, 10).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Flexible Projects Grid */}
          <FlexibleProjectsGrid projects={filteredProjects} />

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                {searchQuery || selectedTags.length > 0 
                  ? "No projects match your search criteria." 
                  : "No projects found. Check back soon for updates!"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ProjectCard({ project, size = "medium" }: { project: Project; size?: "small" | "medium" | "large" | "compact" }) {
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

  // Size-based classes
  const sizeClasses = {
    small: {
      card: "h-48",
      image: "aspect-video",
      title: "text-lg",
      description: "text-sm line-clamp-2",
      padding: "p-4"
    },
    medium: {
      card: "h-full min-h-[300px]",
      image: "aspect-video",
      title: "text-xl",
      description: "text-sm line-clamp-3",
      padding: "p-6"
    },
    large: {
      card: "h-full min-h-[400px]",
      image: "aspect-video",
      title: "text-xl",
      description: "text-base line-clamp-3",
      padding: "p-6"
    },
    compact: {
      card: "h-auto min-h-[200px]",
      image: "aspect-video",
      title: "text-lg",
      description: "text-sm line-clamp-2",
      padding: "p-4"
    }
  };

  const classes = sizeClasses[size];

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${classes.card}`}>
      {imageUrl ? (
        // Layout with image
        <div className="flex flex-col h-full">
          {/* Image Section */}
          <div className={`${classes.image} relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5`}>
            <img
              src={imageUrl}
              alt={`${project.title} cover`}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          {/* Content Section */}
          <CardContent className={`${classes.padding} flex-1 flex flex-col`}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              {project.status && (
                <Badge variant="secondary" className="text-xs">
                  {project.status}
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.updatedAt && format(new Date(project.updatedAt), "MMM d, yyyy")}
              </span>
            </div>

            <h3 className={`font-sans font-semibold ${classes.title} mb-3 group-hover:text-primary transition-colors flex-shrink-0`}>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </h3>

            <p className={`text-muted-foreground mb-4 ${classes.description} flex-1`}>
              {project.description}
            </p>

            {project.tags && project.tags.length > 0 && size !== "small" && (
              <div className="flex flex-wrap gap-1 mt-auto">
                {project.tags.slice(0, size === "large" ? 4 : 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      ) : (
        // Layout without image - original compact design
        <CardContent className={`${classes.padding} h-full flex flex-col`}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            {project.status && (
              <Badge variant="secondary" className="text-xs">
                {project.status}
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {project.updatedAt && format(new Date(project.updatedAt), "MMM d, yyyy")}
            </span>
          </div>

          <h3 className={`font-sans font-semibold ${classes.title} mb-3 group-hover:text-primary transition-colors`}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>

          <p className={`text-muted-foreground mb-4 ${classes.description} flex-1`}>
            {project.description}
          </p>

          {project.tags && project.tags.length > 0 && size !== "small" && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {project.tags.slice(0, size === "large" ? 4 : 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
