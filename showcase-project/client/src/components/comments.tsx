import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseConfigured, type Comment } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CommentsProps {
  postSlug: string;
  postType: "post" | "project";
}

export function Comments({ postSlug, postType }: CommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Site owner email for author badge (from env var)
  const siteOwnerEmail = import.meta.env.VITE_SITE_OWNER_EMAIL as string | undefined;

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postSlug, postType],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_slug", postSlug)
        .eq("post_type", postType)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: supabaseConfigured,
  });

  const submitComment = useMutation({
    mutationFn: async () => {
      if (!supabaseConfigured) {
        throw new Error("Comments are not configured yet.");
      }

      const lastSubmit = localStorage.getItem("lastCommentTime");
      if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
        throw new Error("Please wait a minute between comments.");
      }

      // Submit comment via API endpoint (handles Supabase insert + email notification)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "comment",
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          postSlug,
          postType,
          honeypot,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit comment");
      }

      localStorage.setItem("lastCommentTime", String(Date.now()));
    },
    onSuccess: () => {
      setName("");
      setEmail("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["comments", postSlug, postType] });
      toast({
        title: "Comment posted!",
        description: "Your comment has been added.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <section className="border-t border-border pt-12 mt-12">
      <h2 className="text-2xl font-sans font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Supabase not configured notice */}
      {!supabaseConfigured && (
        <p className="text-muted-foreground text-center py-4 mb-8 text-sm italic">
          Comment system is being set up. Check back soon!
        </p>
      )}

      {/* Comment list */}
      <div className="space-y-6 mb-12">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-32 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        )}
        {comments.map((comment) => {
          const isAuthor = siteOwnerEmail && comment.author_email?.toLowerCase() === siteOwnerEmail.toLowerCase();
          return (
            <Card key={comment.id} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm font-sans">
                      {comment.author_name}
                    </span>
                    {isAuthor && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Author
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </CardContent>
            </Card>
          );
        })}
        {comments.length === 0 && !isLoading && supabaseConfigured && (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* Comment form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitComment.mutate();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comment-name">Name *</Label>
                <Input
                  id="comment-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="comment-email">
                  Email *
                </Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Honeypot — hidden from users, catches bots */}
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="comment-website">Website</Label>
              <Input
                id="comment-website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="comment-message">Comment *</Label>
              <Textarea
                id="comment-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={5000}
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>

            <Button
              type="submit"
              disabled={submitComment.isPending || !name.trim() || !email.trim() || !message.trim()}
            >
              {submitComment.isPending ? "Submitting..." : "Submit Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
