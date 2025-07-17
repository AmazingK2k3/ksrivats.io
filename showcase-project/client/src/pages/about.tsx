import { BookOpen, Podcast, MessageSquare, Sparkles, Heart, Coffee, Code } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import profilePhoto from "@assets/profile_1752217997980.jpg";

export default function About() {
  const highlights = [
    {
      icon: Sparkles,
      title: "Current Focus",
      description: "Building thinking machines at Lossfunk",
      color: "from-primary/20 to-primary/30",
    },
    {
      icon: MessageSquare,
      title: "Writing",
      description: "250+ essays on AI, philosophy, and entrepreneurship",
      color: "from-accent/20 to-accent/30",
    },
    {
      icon: BookOpen,
      title: "Mental Models Book",
      description: "For startup founders and entrepreneurs",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Podcast,
      title: "Bold Conjectures",
      description: "Weekly podcast exploring big ideas",
      color: "from-accent/30 to-accent/40",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Human-Centered AI",
      description: "Building AI systems that complement and enhance human capabilities rather than replace them.",
    },
    {
      icon: Coffee,
      title: "Continuous Learning",
      description: "Staying curious and constantly exploring new ideas at the intersection of technology and humanity.",
    },
    {
      icon: Code,
      title: "Open Exploration",
      description: "Sharing knowledge and insights through writing, speaking, and open-source contributions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl">
              <img
                src={profilePhoto}
                alt="Paras Chopra"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
              About Me
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I'm passionate about building machines that think and create like humans, exploring the frontiers of AI, consciousness, and human creativity.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-sans font-bold mb-6">My Journey</h2>
                <p className="text-muted-foreground mb-6">
                  I'm currently focused on AI research at <strong className="text-foreground">Lossfunk</strong>, where I explore the fundamental questions about intelligence, consciousness, and creativity. My work sits at the intersection of artificial intelligence, philosophy, and human creativity.
                </p>
                <p className="text-muted-foreground mb-6">
                  What fascinates me most is not just building AI systems that can perform tasks, but understanding how we can create machines that think and create in ways that complement human intelligence. I believe the future of AI lies not in replacing human creativity, but in amplifying it.
                </p>
                <p className="text-muted-foreground mb-6">
                  Beyond my research, I'm passionate about sharing knowledge and insights. I've written over 250 essays on topics ranging from AI and philosophy to entrepreneurship and mental models. I also host the <strong className="text-foreground">Bold Conjectures</strong> podcast, where I explore big ideas with fellow thinkers and creators.
                </p>
                <p className="text-muted-foreground mb-6">
                  When I'm not working on AI systems, you'll find me maintaining my digital garden of interconnected thoughts, writing about mental models for entrepreneurs, or exploring the philosophical implications of artificial intelligence.
                </p>
              </div>
            </div>

            <div>
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-sans font-semibold text-lg mb-6">Current Projects</h3>
                  <div className="space-y-4">
                    {highlights.map((highlight) => (
                      <div key={highlight.title} className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${highlight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <highlight.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sans font-medium text-sm mb-1">
                            {highlight.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-sans font-bold mb-8 text-center">What I Believe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-sans font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-sans font-bold mb-6">Technical Focus</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Artificial Intelligence",
                  "Machine Learning",
                  "Consciousness Research",
                  "Philosophy of Mind",
                  "Knowledge Systems",
                  "Creative AI",
                  "Human-AI Interaction",
                  "Digital Gardens",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-sans font-bold mb-6">Research Interests</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Safety",
                  "Computational Creativity",
                  "Epistemology",
                  "Entrepreneurship",
                  "Mental Models",
                  "Systems Thinking",
                  "Future of Work",
                  "Technology Ethics",
                ].map((interest) => (
                  <Badge key={interest} variant="outline" className="text-sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-sans font-bold mb-6">Let's Connect</h2>
            <p className="text-xl text-muted-foreground mb-8">
              I'm always interested in discussing ideas, collaborating on projects, or simply connecting with fellow thinkers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Read My Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
