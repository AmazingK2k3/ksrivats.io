import { BookOpen, Podcast, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  const highlights = [
    {
      icon: Sparkles,
      title: "Current Role",
      description: "AI POC Research Intern at Siemens",
      color: "from-primary/20 to-primary/30",
    },
    {
      icon: BookOpen,
      title: "Education",
      description: "Computing & Data Science + International Relations",
      color: "from-accent/20 to-accent/30",
    },
    {
      icon: MessageSquare,
      title: "Research",
      description: "AI consciousness, creativity, and meaning",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Podcast,
      title: "Philosophy",
      description: "Mindfulness, awareness, and moment-to-moment living",
      color: "from-accent/30 to-accent/40",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 gradient-text">
              About Me
            </h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>
                I'm passionate about building and creating things of value, one moment at a time. My work focuses on the intersection of artificial intelligence, consciousness, and human creativity—optimizing for interestingness rather than conventional metrics.
              </p>
              <p>
                Currently at <strong className="text-foreground">Siemens</strong> as an AI POC Research Intern, I explore how AI can augment human creativity and awareness. My academic background combines computing and data science with international relations, giving me a unique perspective on technology's role in society.
              </p>
              <p>
                I write papers, practice mindfulness, and believe in the power of consistency and compounding. My approach is grounded in awareness and peace, finding meaning in the pursuit of creating things I love.
              </p>
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {highlights.map((highlight) => (
                    <div key={highlight.title} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${highlight.color} rounded-xl flex items-center justify-center`}>
                        <highlight.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-sans font-semibold text-foreground">
                          {highlight.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
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
      </div>
    </section>
  );
}
