import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Tag, Search } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";

interface Creative {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  featured: boolean;
  cover?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Creatives() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: creatives = [], isLoading } = useQuery<Creative[]>({
    queryKey: ["/api/creatives"],
  });

  const { data: searchResults = [] } = useQuery<Creative[]>({
    queryKey: ["/api/creatives/search", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      // For now, we'll do client-side filtering. In the future, implement server-side search
      return creatives.filter(creative => 
        creative.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creative.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creative.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    },
  });

  const filteredCreatives = searchQuery ? searchResults : creatives;

  // Get all unique tags and categories
  const allTags = Array.from(new Set(creatives.flatMap(creative => creative.tags || [])));
  const allCategories = Array.from(new Set(creatives.map(creative => creative.category).filter(Boolean))) as string[];

  const displayedCreatives = filteredCreatives.filter((creative) => {
    if (selectedTag && !creative.tags?.includes(selectedTag)) return false;
    if (selectedCategory && creative.category !== selectedCategory) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
                Creative Corner
              </h1>
              <p className="text-xl text-muted-foreground">
                Artistic explorations, sketches, and creative experiments
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded mb-3" />
                    <div className="h-4 bg-muted rounded mb-4" />
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
              Creative Corner
            </h1>
            <p className="text-xl text-muted-foreground">
              Artistic explorations, sketches, and creative experiments
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search creatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All Categories
              </Button>
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category || '')}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("")}
              >
                All Tags
              </Button>
              {allTags.slice(0, 10).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Creatives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCreatives.map((creative) => (
              <CreativeCard key={creative.id} creative={creative} />
            ))}
          </div>

          {displayedCreatives.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No creatives found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function CreativeCard({ creative }: { creative: Creative }) {
  return (
    <Card className="group hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          {creative.category && (
            <Badge variant="secondary" className="text-xs">
              {creative.category}
            </Badge>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {creative.updatedAt && format(new Date(creative.updatedAt), "MMM d, yyyy")}
          </span>
        </div>

        <h3 className="font-sans font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
          <Link href={`/creatives/${creative.slug}`}>{creative.title}</Link>
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {creative.description}
        </p>

        {creative.tags && creative.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {creative.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
