import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UpvotesProps {
  postSlug: string;
  postType: "post" | "project";
}

export function Upvotes({ postSlug, postType }: UpvotesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  // Load email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Fetch upvote count
  const { data: upvoteCount = 0 } = useQuery({
    queryKey: ["upvotes", postSlug, postType],
    queryFn: async () => {
      if (!supabase) return 0;
      const { count, error } = await supabase
        .from("upvotes")
        .select("*", { count: "exact", head: true })
        .eq("post_slug", postSlug)
        .eq("post_type", postType);

      if (error) throw error;
      return count || 0;
    },
    enabled: supabaseConfigured,
  });

  // Check if current user has already upvoted
  const { data: hasVoted = false } = useQuery({
    queryKey: ["upvote-status", postSlug, postType, email],
    queryFn: async () => {
      if (!supabase || !email) return false;
      const { data, error } = await supabase
        .from("upvotes")
        .select("id")
        .eq("post_slug", postSlug)
        .eq("post_type", postType)
        .eq("user_email", email.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: supabaseConfigured && !!email,
  });

  // Submit upvote mutation
  const submitUpvote = useMutation({
    mutationFn: async (userEmail: string) => {
      if (!supabase) {
        throw new Error("Upvotes are not configured yet.");
      }

      // Check if already voted
      const { data: existing } = await supabase
        .from("upvotes")
        .select("id")
        .eq("post_slug", postSlug)
        .eq("post_type", postType)
        .eq("user_email", userEmail.toLowerCase())
        .maybeSingle();

      if (existing) {
        throw new Error("You've already upvoted this!");
      }

      // Insert upvote
      const { error } = await supabase.from("upvotes").insert({
        post_slug: postSlug,
        post_type: postType,
        user_email: userEmail.toLowerCase(),
      });

      if (error) throw error;

      // Save email to localStorage
      localStorage.setItem("userEmail", userEmail);
      setEmail(userEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upvotes", postSlug, postType] });
      queryClient.invalidateQueries({ queryKey: ["upvote-status", postSlug, postType, email] });
      setShowEmailDialog(false);
      toast({
        title: "Thanks for the upvote!",
        description: "Your support means a lot.",
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

  const handleUpvoteClick = () => {
    if (!supabaseConfigured) {
      toast({
        title: "Upvotes not available",
        description: "The upvote system is being set up.",
        variant: "destructive",
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: "Already upvoted",
        description: "You've already upvoted this!",
      });
      return;
    }

    // If email is saved, submit directly; otherwise show dialog
    if (email) {
      submitUpvote.mutate(email);
    } else {
      setShowEmailDialog(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      submitUpvote.mutate(email.trim());
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 py-4">
        <Button
          variant={hasVoted ? "secondary" : "outline"}
          size="sm"
          onClick={handleUpvoteClick}
          disabled={submitUpvote.isPending || hasVoted}
          className="gap-2"
        >
          <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
          {hasVoted ? "Upvoted" : "Upvote"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {upvoteCount} {upvoteCount === 1 ? "upvote" : "upvotes"}
        </span>
      </div>

      {/* Email dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upvote this {postType === "post" ? "post" : "project"}</DialogTitle>
            <DialogDescription>
              Enter your email to upvote. We'll remember it for future votes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="upvote-email">Email</Label>
                <Input
                  id="upvote-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!email.trim() || submitUpvote.isPending}>
                {submitUpvote.isPending ? "Submitting..." : "Upvote"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
