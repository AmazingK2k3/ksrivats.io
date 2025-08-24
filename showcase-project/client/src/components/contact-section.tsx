import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Mail, User, MessageCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    } else if (formData.email.trim().length > 254) {
      errors.email = "Email address is too long";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long";
    } else if (formData.message.trim().length > 2000) {
      errors.message = "Message must be less than 2000 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const validData = insertContactSchema.parse(data);
      return await apiRequest("POST", "/api/contact", validData);
    },
    onSuccess: (response: any) => {
      const emailSent = response.emailSent;
      const remainingRequests = response.remainingRequests;
      
      toast({
        title: "Message sent successfully!",
        description: emailSent 
          ? "Thanks for reaching out! I'll get back to you soon via email."
          : "Thanks for reaching out! Your message has been received and I'll get back to you soon.",
      });
      
      if (remainingRequests !== undefined && remainingRequests <= 2) {
        toast({
          title: "Rate limit notice",
          description: `You have ${remainingRequests} more messages remaining in the next 15 minutes.`,
          variant: "default",
        });
      }
      
      setFormData({ name: "", email: "", message: "" });
      setFormErrors({});
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error: any) => {
      console.error("Contact form error:", error);
      
      // Handle specific error cases
      if (error?.response?.status === 429) {
        const resetTime = error.response.data?.resetTime;
        const resetDate = resetTime ? new Date(resetTime) : null;
        const timeUntilReset = resetDate ? Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60)) : 15;
        
        toast({
          title: "Too many requests",
          description: `Please wait ${timeUntilReset} minutes before sending another message.`,
          variant: "destructive",
        });
      } else if (error?.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Invalid input";
        const errors = error.response.data?.errors || [];
        
        toast({
          title: "Validation Error",
          description: errors.length > 0 ? errors.join(", ") : errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to send message",
          description: "Something went wrong. Please try again or contact me directly via email.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      contactMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 gradient-text">
            Let's Connect
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a project in mind, want to collaborate, or just want to say hello? 
            I'd love to hear from you and discuss how we can work together.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 text-center justify-center">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Send me a message</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`h-12 ${formErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-12 ${formErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive">{formErrors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, ideas, or just say hello..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 2000) {
                        handleInputChange("message", value);
                      }
                    }}
                    className={`resize-none ${formErrors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    required
                  />
                  {formErrors.message && (
                    <p className="text-sm text-destructive">{formErrors.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 font-sans font-medium text-base transition-all duration-200 hover:scale-[1.02]"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending your message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Success State */}
                {contactMutation.isSuccess && (
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Message sent successfully!</span>
                  </div>
                )}
              </form>

              {/* Alternative Contact */}
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Prefer email? Reach me directly at{" "}
                  <a 
                    href="mailto:kaushiksrivatsan03@gmail.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    kaushiksrivatsan03@gmail.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Time Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            I typically respond within 24 hours during weekdays
          </p>
        </div>
      </div>
    </section>
  );
}