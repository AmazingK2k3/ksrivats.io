import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Twitter, Linkedin, Github, Instagram, Dribbble, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validData = insertContactSchema.parse(data);
      return await apiRequest("POST", "/api/contact", validData);
    },
    onSuccess: (response: any) => {
      const emailSent = response.emailSent;
      toast({
        title: "Message sent!",
        description: emailSent 
          ? "Thanks for reaching out. I'll get back to you soon via email."
          : "Thanks for reaching out. Your message has been received and I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact me directly via email.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const socialLinks = [
    {
      name: "Email",
      href: "mailto:kaushiksrivatsan03@gmail.com",
      icon: Send,
      color: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
    },
    {
      name: "LinkedIn",
      href: "http://www.linkedin.com/in/kaushik-srivatsan",
      icon: Linkedin,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
      name: "GitHub",
      href: "http://github.com/AmazingK2k3",
      icon: Github,
      color: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
    },
    {
      name: "Twitter",
      href: "https://x.com/KaushikSrivats1?t=FbrkdannY0_qpvyU6k0WwQ&s=09",
      icon: Twitter,
      color: "bg-sky-500/10 text-sky-600 hover:bg-sky-500/20",
    },
    {
      name: "Behance",
      href: "https://www.behance.net/kaushiksrivats",
      icon: Palette,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/sk_tryingdesign/",
      icon: Instagram,
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 gradient-text">
          Say Hi!
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Have a question, idea, or just want to say hello? I'd love to hear from you.
        </p>

        <div className="space-y-8 mb-12">
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <Textarea
                    placeholder="Your message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-sans"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Connect with me</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You can also reach me through these platforms:
                </p>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-medium">{social.name}</span>
                    </a>
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