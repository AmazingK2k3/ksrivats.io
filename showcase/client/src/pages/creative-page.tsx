import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export default function CreativePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: creative, isLoading, error } = useQuery<Creative>({
    queryKey: ["/api/creatives", slug],
    enabled: !!slug,
  });

  const { data: relatedCreatives = [] } = useQuery<Creative[]>({
    queryKey: ["/api/creatives/featured"],
    enabled: !!creative,
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

  if (error || !creative) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-sans font-bold mb-4">Creative Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The creative piece you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/creatives">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Creatives
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: creative.title,
          text: creative.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/creatives">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Creatives
            </Link>
          </Button>

          {/* Creative Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {creative.category && (
                <Badge variant="secondary" className="text-xs">
                  {creative.category}
                </Badge>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {creative.updatedAt && format(new Date(creative.updatedAt), "MMMM d, yyyy")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">
              {creative.title}
            </h1>

            {creative.description && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {creative.description}
              </p>
            )}

            {creative.tags && creative.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {creative.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
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

          {/* Creative Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div dangerouslySetInnerHTML={{ __html: creative.content }} />
          </div>

          {/* Related Creatives */}
          {relatedCreatives.length > 0 && (
            <section className="border-t border-border pt-12">
              <h2 className="text-2xl font-sans font-bold mb-8">Related Creatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedCreatives.slice(0, 2).map((relatedCreative: Creative) => (
                  <Card key={relatedCreative.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        {relatedCreative.category && (
                          <Badge variant="secondary" className="text-xs">
                            {relatedCreative.category}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {relatedCreative.updatedAt && format(new Date(relatedCreative.updatedAt), "MMM yyyy")}
                        </span>
                      </div>
                      <h3 className="font-sans font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                        <Link href={`/creatives/${relatedCreative.slug}`}>{relatedCreative.title}</Link>
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedCreative.description}
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
