import { Twitter, Linkedin, Github, Instagram, Mail, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

const socialLinks = [
  {
    name: "Email",
    href: "mailto:kaushiksrivatsan03@gmail.com",
    icon: Mail,
    color: "hover:text-red-500",
    bgColor: "hover:bg-red-500/10",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kaushik-srivatsan",
    icon: Linkedin,
    color: "hover:text-blue-600",
    bgColor: "hover:bg-blue-600/10",
  },
  {
    name: "GitHub",
    href: "https://github.com/AmazingK2k3",
    icon: Github,
    color: "hover:text-gray-800 dark:hover:text-gray-200",
    bgColor: "hover:bg-gray-800/10",
  },
  {
    name: "Twitter",
    href: "https://x.com/KaushikSrivats1?t=FbrkdannY0_qpvyU6k0WwQ&s=09",
    icon: Twitter,
    color: "hover:text-sky-500",
    bgColor: "hover:bg-sky-500/10",
  },
  {
    name: "Behance",
    href: "https://www.behance.net/kaushiksrivats",
    icon: Palette,
    color: "hover:text-purple-600",
    bgColor: "hover:bg-purple-600/10",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/sk_tryingdesign/",
    icon: Instagram,
    color: "hover:text-pink-600",
    bgColor: "hover:bg-pink-600/10",
  },
];

export function SocialLinks({ 
  variant = "horizontal", 
  size = "md", 
  showLabels = false, 
  className 
}: SocialLinksProps) {
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const buttonSize = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  return (
    <div
      className={cn(
        "flex gap-2",
        variant === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className
      )}
    >
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          variant="ghost"
          size={showLabels ? "sm" : "icon"}
          asChild
          className={cn(
            "transition-all duration-200",
            !showLabels && buttonSize,
            social.color,
            social.bgColor
          )}
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={showLabels ? "justify-start" : ""}
          >
            <social.icon className={iconSize} />
            {showLabels && (
              <span className="ml-2 text-sm font-medium">{social.name}</span>
            )}
          </a>
        </Button>
      ))}
    </div>
  );
}
