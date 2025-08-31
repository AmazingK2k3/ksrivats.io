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
      description: "Mech Interp, VLMs, RAG, Ai Dev, Graph Neural Networks, Tech Policy",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Heart,
      title: "Current Interests",
      description: "Responsible AI & AI Safety, Geopolitics, Economics, Institutions, Understanding People & Power",
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
                I'm a researcher, builder, and explorer working at the intersection of AI, institutions, and society. Currently at <strong className="text-foreground">Siemens</strong>, I work as an AI engineer developing VLM, RAG, and Computer Vision applications for industrial automation.
              </p>
              <p>
                Beyond engineering, I'm passionate about research across diverse domains—from responsible AI and tech policy to geopolitics and understanding how technology shapes human connection. I co-founded <strong className="text-foreground">Zeitgeist</strong>, an IR journal, and love connecting with people from different backgrounds to challenge my assumptions.
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
