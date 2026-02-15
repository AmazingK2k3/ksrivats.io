import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Calendar, Tag, ArrowLeft, Share2, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Post } from "@shared/schema";
import { CitationProcessor } from "@/components/citation-processor";
import { Comments } from "@/components/comments";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["/api/posts", slug],
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts", { featured: true }],
    queryFn: () => fetch("/api/posts?featured=true").then(res => res.json()),
    enabled: !!post,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-4 w-32" />
              <div className="h-12 bg-muted rounded mb-6" />
              <div className="h-4 bg-muted rounded mb-8 w-48" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-sans font-bold mb-4">Post Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      // Try native sharing first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: url,
        });
        return; // If sharing succeeds, we're done
      }
    } catch (shareError) {
      console.log("Native sharing failed, falling back to clipboard");
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "URL Copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (clipboardError) {
      // Ultimate fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        
        toast({
          title: "URL Copied!",
          description: "The link has been copied to your clipboard.",
        });
      } catch (fallbackError) {
        toast({
          title: "Share Failed",
          description: "Unable to copy the URL. Please copy it manually from the address bar.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Post Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.publishedAt && format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setLocation(`/blog?tag=${encodeURIComponent(tag)}`)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Post Content with Citation Support */}
          <CitationProcessor
            htmlContent={post.content}
            className="prose prose-lg max-w-none mb-16"
          />

          {/* Comments */}
          <Comments postSlug={post.slug} postType="post" />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-border pt-12">
              <h2 className="text-2xl font-sans font-bold mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost: Post) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        {relatedPost.category && (
                          <Badge variant="secondary" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {relatedPost.publishedAt && format(new Date(relatedPost.publishedAt), "MMM yyyy")}
                        </span>
                      </div>
                      <h3 className="font-sans font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
