import { ArrowRight, Sparkles, BookOpen, Podcast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import profilePhoto from "@assets/profile_1752217997980.jpg";

export function Hero() {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold leading-tight mb-6">
              <span className="gradient-text">Building and Creating</span>
              <br />
              <span className="text-foreground">things of</span>
              <br />
              <span className="gradient-text">Value</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
              I'm Kaushik Srivatsan, and this is my digital home. Currently working as an AI POC Research Intern at{" "}
              <span className="text-primary font-medium">Siemens</span>, exploring the intersection of consciousness, creativity, and artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/blog">
                  Explore My Writing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </div>

          <div className="animate-slide-up">
            <div className="relative">
              <div className="w-full max-w-md mx-auto">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-primary/20">
                  <img
                    src={profilePhoto}
                    alt="Professional photo of Kaushik Srivatsan"
                    className="w-full h-full object-cover animate-float"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent/30 to-accent/40 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuickNavigation() {
  const items = [
    {
      icon: Sparkles,
      title: "Start Here",
      description: "Get an overview of my work and interests",
      href: "/about",
      color: "from-primary/20 to-primary/30",
    },
    {
      icon: BookOpen,
      title: "Tryst with Projects",
      description: "My project portfolio and technical journey",
      href: "/projects",
      color: "from-accent/20 to-accent/30",
    },
    {
      icon: BookOpen,
      title: "Writing Musings",
      description: "My digital garden of notes and thoughts",
      href: "/blog",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Podcast,
      title: "Creative Corner",
      description: "Creative explorations, sketches, and visual thoughts",
      href: "/creatives",
      color: "from-accent/30 to-accent/40",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="h-full hover:shadow-xl transition-shadow group cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-sans font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
