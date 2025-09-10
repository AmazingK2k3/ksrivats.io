import { useQuery } from "@tanstack/react-query";
import type { Post, Project } from "@shared/schema";

export function usePosts() {
  return useQuery({
    queryKey: ["/api/posts"],
    select: (data: Post[]) => data.filter(post => post.published),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["/api/posts", slug],
    enabled: !!slug,
  });
}

export function useFeaturedPosts() {
  return useQuery({
    queryKey: ["/api/posts", "featured"],
    queryFn: async () => {
      const response = await fetch('/api/posts?featured=true');
      return response.json();
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["/api/projects"],
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["/api/projects", slug],
    enabled: !!slug,
  });
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ["/api/projects", "featured"],
    queryFn: async () => {
      const response = await fetch('/api/projects?featured=true');
      return response.json();
    },
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["/api/posts", query],
    enabled: query.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/posts?q=${encodeURIComponent(query)}`);
      return response.json();
    },
  });
}
