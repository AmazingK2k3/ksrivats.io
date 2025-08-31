import { Link } from "wouter";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SocialLinks } from "@/components/social-links";

// Assuming these assets are correctly pathed in your project setup
import logoKLight from "@assets/Vector_1752222029379.png";
import logoKDark from "@assets/Layer 3_1752222033300.png";

const LogoK = () => (
  <>
    <img src={logoKDark} alt="Kaushik Srivatsan" className="w-8 h-8 dark:hidden" />
    <img src={logoKLight} alt="Kaushik Srivatsan" className="w-8 h-8 hidden dark:block" />
  </>
);

interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
}

export function Footer() {
  const { data: recentPosts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: recentProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get the 4 most recent posts and projects
  const topPosts = recentPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const topProjects = recentProjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50 dark:bg-[#311024]  border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <LogoK />
              </div>
              <span className="font-sans font-semibold text-lg">Kaushik Srivatsan</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Building and creating things of value. Researcher, Builder & Explorer. Designing responsible technology for our changing world.
            </p>
            
            {/* Social Links - prominently placed */}
            <div>
              <h4 className="font-sans font-semibold text-sm mb-3 text-foreground">Connect with me</h4>
              <SocialLinks variant="horizontal" size="md" className="gap-3" />
            </div>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold text-lg mb-4">Recent Writing</h4>
            <ul className="space-y-2 text-muted-foreground">
              {topPosts.length > 0 ? (
                topPosts.map((post) => (
                  <li key={post.id}>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="hover:text-primary transition-colors text-sm line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm">No recent posts</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-lg mb-4">Recent Projects</h4>
            <ul className="space-y-2 text-muted-foreground">
              {topProjects.length > 0 ? (
                topProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-primary transition-colors text-sm line-clamp-1"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm">No recent projects</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © 2025 Kaushik Srivatsan. Built with love and curiosity.
              <Heart className="w-4 h-4 text-red-500" />
            </p>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              <Link href="/contact" className="hover:text-primary transition-colors">
                Get in touch!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}