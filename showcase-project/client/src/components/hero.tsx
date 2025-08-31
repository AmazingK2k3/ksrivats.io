import { ArrowRight, Sparkles, Briefcase, PenSquare, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import profilePhoto from "@/assets/images/profile_1752217997980.jpg";

export function Hero() {
  return (
    <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold leading-tight mb-6">
              <span className="gradient-text">Researcher. Builder. Wanderer.</span>
              {/* <br />
              <span className="text-foreground">things of</span>
              <br />
              <span className="gradient-text">Value</span> */}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
              I'm Kaushik Srivatsan, welcome to my digital home!  I'm a researcher, builder, and explorer working at the intersection of AI, institutions, and society. Currently working in Gen AI R&D at {" "}
              <span className="text-primary font-medium">Siemens</span>, creating responsible technology for our changing world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/blog">
                  Explore My Writing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/projects">View My Projects</Link>
              </Button>
            </div>
          </div>

          <div className="animate-slide-up">
            <div className="relative">
              <div className="w-full max-w-md mx-auto">
                <div className="aspect-square rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-primary/20 hover:animate-float transition-all duration-300 group">
                  <img
                    src={profilePhoto}
                    alt="Professional photo of Kaushik Srivatsan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full opacity-60" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent/30 to-accent/40 rounded-full opacity-40" />
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
      description: "Get to know about me, my work and interests!",
      href: "/about",
    },
    {
      icon: Briefcase,
      title: "Tryst with Projects",
      description: "All my hobby projects & explorations in one place",
      href: "/projects",
    },
    {
      icon: PenSquare,
      title: "Writing Musings",
      description: "My digital garden of notes and thoughts",
      href: "/blog",
    },
    {
      icon: Paintbrush,
      title: "Creative Corner",
      description: "Creative explorations, sketches, and visual thoughts",
      href: "/creatives",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="h-full bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 transition-all duration-300 group cursor-pointer p-2">
                <CardContent className="p-6">
                  <item.icon className="w-7 h-7 mb-5 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
                  <h3 className="font-sans font-bold text-xl mb-2 text-foreground">{item.title}</h3>
                  <p className="text-base text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
