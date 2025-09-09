import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Calendar, Tag, Search } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Post } from "@shared/schema";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/tag/:tag");

  // If we're on a tag route, set the selected tag
  useEffect(() => {
    if (match && params?.tag) {
      const decodedTag = decodeURIComponent(params.tag);
      setSelectedTag(decodedTag);
    } else if (location === "/blog") {
      setSelectedTag("");
    }
  }, [match, params, location]);

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: searchResults = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/posts?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
  });

  const filteredPosts = searchQuery ? searchResults : posts;

  // Get all unique tags and categories
  const allTags = Array.from(new Set(posts.flatMap((post: Post) => post.tags || [])));
  const allCategories = Array.from(new Set(posts.map((post: Post) => post.category).filter(Boolean))) as string[];

  const displayedPosts = filteredPosts.filter((post: Post) => {
    if (selectedTag && !post.tags?.includes(selectedTag)) return false;
    if (selectedCategory && post.category !== selectedCategory) return false;
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
                Writing & Essays
              </h1>
              <p className="text-xl text-muted-foreground">
                Find my articles on various topics here! This is a new website, so content is added gradually. Stay tuned for Technical blogs on LLMs, RAGs and GNNs!
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
              Writing & Essays
            </h1>
            <p className="text-xl text-muted-foreground">
                Find my articles on various topics here! This is a new website, so content is added gradually. Technical blogs on LLMs, RAGs and GNNs comming soon!
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
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
                onClick={() => {
                  setSelectedTag("");
                  setLocation("/blog");
                }}
              >
                All Tags
              </Button>
              {allTags.slice(0, 10).map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTag(tag);
                    setLocation(`/blog/tag/${encodeURIComponent(tag)}`);
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post: Post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {displayedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No posts found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function BlogCard({ post }: { post: Post }) {
  const [, setLocation] = useLocation();
  
  return (
    <Card className="group hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {post.publishedAt && format(new Date(post.publishedAt), "MMM d, yyyy")}
          </span>
        </div>

        <h3 className="font-sans font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setLocation(`/blog/tag/${encodeURIComponent(tag)}`);
                }}
              >
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
