import { BookOpen, Users, MessageSquare, Sparkles, Globe, Building, Briefcase, GraduationCap, Code, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function AboutSection() {
  const highlights = [
    {
      icon: Briefcase,
      title: "Current Role",
      description: "Tech Apprentice at Siemens",
      color: "from-primary/20 to-primary/30",
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "BTech Computing & Data Science + International Relations",
      color: "from-accent/20 to-accent/30",
    },
    {
      icon: Code,
      title: "Tech Focus",
      description: "Mech Interp, Eval-Awareness, Activation Steering & Probing, RAG, Graph Neural Networks",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Heart,
      title: "Current Interests",
      description: "AI Safety, Gradual Disempowerment, Catastrophic Risks by AI, Defensive Acceleration of Empowering Technology, Understanding People & Power",
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
                I'm a researcher, builder, explorer and an artist working at the intersection of AI, institutions, and society. Currently at <strong className="text-foreground">Siemens</strong>, I work as an AI engineer developing VLM, RAG, and Gen AI applications for industrial automation.
              </p>
              <p>
                Beyond work, I'm currently passionate about research across the field of AI Safety, Gradual disempowerment and technologies that can empower people in the post-AGI era. I generally love to think about complex problems and circumstances, keeping people at the center. I co-founded <strong className="text-foreground">Zeitgeist</strong>, an IR journal, and love connecting with people from different backgrounds to challenge my assumptions. I also write essays on my personal blog about AI, Geopolitics and other topics that I find interesting.
              </p>
              <div className="pt-2">
                <Link href="/about" className="text-primary font-medium hover:underline">
                  Know more about me →
                </Link>
              </div>
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
