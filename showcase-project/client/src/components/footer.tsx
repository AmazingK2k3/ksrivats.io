import { Link } from "wouter";
import { Twitter, Linkedin, Github, Heart } from "lucide-react";
import logoKLight from "@assets/Vector_1752222029379.png";
import logoKDark from "@assets/Layer 3_1752222033300.png";

const LogoK = () => (
  <>
    <img src={logoKDark} alt="Kaushik Srivatsan" className="w-8 h-8 dark:hidden" />
    <img src={logoKLight} alt="Kaushik Srivatsan" className="w-8 h-8 hidden dark:block" />
  </>
);

export function Footer() {
  const navigation = {
    explore: [
      { name: "Recent Essays", href: "/blog" },
      { name: "Research Papers", href: "/projects" },
      { name: "AI & Consciousness", href: "/blog" },
      { name: "Mindful Computing", href: "/projects/mindful-computing" },
    ],
    projects: [
      { name: "Siemens AI Research", href: "/projects/siemens-ai-research" },
      { name: "Mindful Computing", href: "/projects/mindful-computing" },
      { name: "Academic Papers", href: "/projects/academic-papers" },
    ],
    social: [
      {
        name: "Twitter",
        href: "https://x.com/KaushikSrivats1?t=FbrkdannY0_qpvyU6k0WwQ&s=09",
        icon: Twitter,
      },
      {
        name: "LinkedIn",
        href: "http://www.linkedin.com/in/kaushik-srivatsan",
        icon: Linkedin,
      },
      {
        name: "GitHub",
        href: "http://github.com/AmazingK2k3",
        icon: Github,
      },
    ],
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <LogoK />
              </div>
              <span className="font-sans font-semibold text-lg">Kaushik Srivatsan</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Building and creating things of value. AI researcher exploring consciousness, creativity, and the meaningful intersection of technology and human experience.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-lg mb-4">Explore</h4>
            <ul className="space-y-2 text-muted-foreground">
              {navigation.explore.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link href={item.href} className="hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-lg mb-4">Projects</h4>
            <ul className="space-y-2 text-muted-foreground">
              {navigation.projects.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © 2025 Kaushik Srivatsan. Built with love and curiosity.
              <Heart className="w-4 h-4 text-red-500" />
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <LogoK />
                <span className="text-sm font-medium text-primary">Digital Home</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
