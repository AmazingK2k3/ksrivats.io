import { BookOpen, Globe, MessageSquare, Sparkles, Heart, Brain, Code, Users, Map, FileText, Lightbulb, Compass } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import profilePhoto from "@/assets/images/profile_1752217997980.jpg";

export default function About() {
  const highlights = [
    {
      icon: Brain,
      title: "Current Role",
      description: "Gen AI R&D at Siemens - Building VLMs, RAG systems, and Gen AI applications",
      color: "from-primary/20 to-primary/30",
    },
    {
      icon: BookOpen,
      title: "Education",
      description: "BTech Computing & Data Science + International Relations Minor at Sai University",
      color: "from-accent/20 to-accent/30",
    },
    {
      icon: Globe,
      title: "Current Exploration",
      description: "AI Safety, Gradual Disempowerment, Catastrophic Risks by AI, Oversquashing on GNNs, Building & Scaling AI/RAG Applications, Responsible AI,  Geopolitics,  and more.",
      color: "from-primary/30 to-primary/40",
    },
    {
      icon: Users,
      title: "People & Commmunity",
      description: "Currently Seeking to be part of and build communities, and volunteer for causes! I want to work with people at groundroot levels from different backgrounds and perspectives to learn and grow together.",
      color: "from-accent/30 to-accent/40",
    },
    {
      icon: Map,
      title: "Career Exploration",
      description: "Figuring out and exploring my career path and trajectory for the next year and my 20s",
      color: "from-primary/25 to-primary/35",
    },
    {
      icon: FileText,
      title: "Resume/CV",
      description: "Check out my detailed CV and experiences",
      color: "from-accent/25 to-accent/35",
      link: "https://docs.google.com/document/d/1bK6rg6eprg2qZWLLNEqUJbXea2VDDhfz642-sAY20c0/edit?usp=sharing",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Building & Creativity",
      description: "Building, experimenting, and creating imperfect work that feels like play. Being obsessed with learning, solving complex problems, and expressing myself through art, code, and stories.",
    },
    {
      icon: Heart,
      title: "People & Stories",
      description: "Deep listening, understanding perspectives, and believing in genuine appreciation that everyone's story matters.",
    },
    {
      icon: Compass,
      title: "Mindful Living",
      description: "Living fully in the present. Embracing uncertainty, trying new things & seeking discomfort for growth. Following gradients of interestingness.",
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
                alt="Kaushik Srivatsan"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-sans font-bold mb-4 gradient-text">
              About Me
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I'm a researcher, builder, and explorer working at the intersection of AI, institutions, and society—fascinated by how technology reshapes our world.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-sans font-bold mb-6">My Journey</h2>
                <p className="text-muted-foreground mb-6">
                  Starting my undergraduate journey post-pandemic, I witnessed firsthand how technology can rapidly transform everything—from education to corporate life. When ChatGPT launched in late 2022, I was among the early student adopters integrating it into my university studies to learn about AI! This sparked my current path in Gen AI R&D at <strong className="text-foreground">Siemens</strong>, where I develop Vision Language Models, RAG systems, and Computer Vision applications solving real-world industrial automation problems.
                </p>
                <p className="text-muted-foreground mb-6">
                  What fascinates me isn't just AI's technical capabilities, but how these technologies reshape geopolitical landscapes and institutions. I've watched in awe and concern as social media, data analytics, and advanced warfare technologies—from drones to AI—rapidly evolved through conflicts like the Taliban takeover in Afghanistan, Myanmar's dictatorship, the Russia-Ukraine war, and the current Israel-Palestine crisis. My interdisciplinary background in Computing & Data Science with International Relations gives me a unique lens for exploring questions at the intersection of technology, people, and society.
                </p>
                <p className="text-muted-foreground mb-6">
                  Beyond my current role, I've explored various paths: analyzing competition data at <strong className="text-foreground">e-Yantra, IIT Bombay</strong> (published at T4E 2024), designing a cryptocurrency learning app as a UX intern at Cabot Technology Solutions, and currently experimenting with solving the Over-Squashing Problem in Graph Neural Networks. I also co-founded and helped in designing <strong className="text-foreground">Zeitgeist</strong>, an IR journal exploring war and collective memory, and served as Student Government President, drafting our university's first student constitution.
                </p>
                <p className="text-muted-foreground mb-6">
                  Over the past year I've gone deep on AI Safety — completing the <strong className="text-foreground">AGI Strategy</strong> course, the <strong className="text-foreground">Technical AI Safety</strong> course and project sprint with BlueDot Impact (where the eval-awareness study was my sprint project), and the <strong className="text-foreground">AI Safety, Ethics &amp; Society</strong> course from the Center for AI Safety (the Disempowerment Dilemma essay was my submission for that). What I keep returning to is a question that feels more urgent the more I look at it: <em>what happens to people's sense of agency and meaning when automation displaces not just their jobs but the kinds of work that gave them purpose?</em> I care deeply about preserving human agency — not just as a policy problem, but as something worth building towards. I also want to become more consistent in my writing and get back to making art, because I think staying creative is part of how I stay honest about why any of this matters.
                </p>
                <p className="text-muted-foreground mb-6">
                  When I'm not engineering or researching, you'll find me reading philosophy, sketching, solving Rubik's cubes, or watching anime :) I'm passionate about connecting with people from diverse backgrounds, always open to new perspectives. As Steve Jobs once said, I'm on a path of exploration, figuring out what I truly love—and I think that's a constant work in progress, just like life itself.
                </p>
              </div>
            </div>

            <div>
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-sans font-semibold text-xl mb-6">TLDR :)</h3>
                  <div className="space-y-4">
                    {highlights.map((highlight) => (
                      <div key={highlight.title} className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${highlight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <highlight.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sans font-medium text-base mb-1">
                            {highlight.link ? (
                              <a 
                                href={highlight.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {highlight.title}
                              </a>
                            ) : (
                              highlight.title
                            )}
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

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-sans font-bold mb-8 text-center">What Drives Me</h2>
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

          {/* Philosophy Section
          <div className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-sans font-bold mb-8">Philosophy & Inspiration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="text-left">
                  <CardContent className="p-6">
                    <blockquote className="text-muted-foreground italic mb-4">
                      "You can't connect the dots looking forward; you can only connect them looking backwards. Follow your gut more. Take pressure off from succeeding—the key aspect is to work on things that are interesting."
                    </blockquote>
                    <cite className="text-sm text-primary">— Steve Jobs (paraphrased)</cite>
                  </CardContent>
                </Card>
                <Card className="text-left">
                  <CardContent className="p-6">
                    <blockquote className="text-muted-foreground italic mb-4">
                      "In the end only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you."
                    </blockquote>
                    <cite className="text-sm text-primary">— Buddha</cite>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <blockquote className="text-muted-foreground italic">
                      "What keeps pushing the world forward is the treasure hunters, the explorers, and people who are quirky about things they work on, not caring about the big goals. The truly great part about exploring what you find fascinating is that even if it doesn't lead to riches, you'd be better off as you would have lived life on your terms."
                    </blockquote>
                    <cite className="text-sm text-primary">— Paras Chopra</cite>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div> */}

          {/* Skills & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-sans font-bold mb-6">Technical Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Vision Language Models (VLMs)",
                  "RAG Systems",
                  "Computer Vision",
                  "Graph Neural Networks",
                  "Machine Learning",
                  "Deep Learning",
                  "Data Analytics",
                  "Data Science",
                  "Python",
                  "AWS",
                  "NLP"
                ].map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-sans font-bold mb-6">Current Interests</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "AI Safety",
                  "Gradual Disempowerment",
                  "Geopolitics",
                  "International Relations",
                  "Mechanistic Interpretability",
                  "Evaluation Awareness",
                  "Activation Steering & Probing",
                  "Pursuing art and writing",
                  "Economics & Financial Markets",
                  "Product Management & Product Design",
                  "Startups & Startup Ecosystem",
                  "Exploring Life, Travel and Communities :)"
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
              If you could relate to any of the interests I talked above or just looking for fun banter—let's connect and explore ideas together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">Explore My Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
