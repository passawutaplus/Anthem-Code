import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminStats {
  totalUsers: number;
  newUsers24h: number;
  totalStudios: number;
  publishedProjects: number;
  openJobs: number;
  pendingHiring: number;
  messages24h: number;
  totalCollections: number;
}

const since = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    refetchInterval: 30_000,
    queryFn: async () => {
      const [users, newUsers, studios, projects, jobs, hiring, msgs, cols] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", since(24)),
        supabase.from("studios").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "Published"),
        supabase.from("job_posts").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("hiring_requests").select("*", { count: "exact", head: true }).eq("status", "ใหม่"),
        supabase.from("messages").select("*", { count: "exact", head: true }).gte("created_at", since(24)),
        supabase.from("collections").select("*", { count: "exact", head: true }),
      ]);
      return {
        totalUsers: users.count ?? 0,
        newUsers24h: newUsers.count ?? 0,
        totalStudios: studios.count ?? 0,
        publishedProjects: projects.count ?? 0,
        openJobs: jobs.count ?? 0,
        pendingHiring: hiring.count ?? 0,
        messages24h: msgs.count ?? 0,
        totalCollections: cols.count ?? 0,
      };
    },
  });
}

export interface TimelinePoint { date: string; users: number; projects: number; jobs: number }

export function useAdminTimeline(days = 14) {
  return useQuery<TimelinePoint[]>({
    queryKey: ["admin-timeline", days],
    queryFn: async () => {
      const start = new Date(Date.now() - days * 86_400_000).toISOString();
      const [u, p, j] = await Promise.all([
        supabase.from("profiles").select("created_at").gte("created_at", start),
        supabase.from("projects").select("created_at").gte("created_at", start),
        supabase.from("job_posts").select("created_at").gte("created_at", start),
      ]);
      const out: TimelinePoint[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
        out.push({
          date: d.slice(5),
          users: (u.data ?? []).filter((r) => r.created_at.slice(0, 10) === d).length,
          projects: (p.data ?? []).filter((r) => r.created_at.slice(0, 10) === d).length,
          jobs: (j.data ?? []).filter((r) => r.created_at.slice(0, 10) === d).length,
        });
      }
      return out;
    },
  });
}

export interface ActivityEvent {
  id: string;
  type: "user" | "project" | "job" | "hire" | "collab" | "studio";
  title: string;
  subtitle: string;
  at: string;
}

export function useLiveActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  // initial fetch
  useEffect(() => {
    (async () => {
      const [p, j, h, c, s, u] = await Promise.all([
        supabase.from("projects").select("id,title,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("job_posts").select("id,title,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("hiring_requests").select("id,project_title,client_name,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("collab_requests").select("id,message,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("studios").select("id,name,created_at").order("created_at", { ascending: false }).limit(10),
        supabase.from("profiles").select("id,display_name,created_at").order("created_at", { ascending: false }).limit(10),
      ]);
      const evs: ActivityEvent[] = [
        ...(p.data ?? []).map((r): ActivityEvent => ({ id: `p-${r.id}`, type: "project", title: "ผลงานใหม่", subtitle: r.title, at: r.created_at })),
        ...(j.data ?? []).map((r): ActivityEvent => ({ id: `j-${r.id}`, type: "job", title: "ประกาศงานใหม่", subtitle: r.title, at: r.created_at })),
        ...(h.data ?? []).map((r): ActivityEvent => ({ id: `h-${r.id}`, type: "hire", title: "คำขอจ้างงาน", subtitle: `${r.client_name} → ${r.project_title}`, at: r.created_at })),
        ...(c.data ?? []).map((r): ActivityEvent => ({ id: `c-${r.id}`, type: "collab", title: "คำขอคอลแลป", subtitle: r.message?.slice(0, 60) ?? "", at: r.created_at })),
        ...(s.data ?? []).map((r): ActivityEvent => ({ id: `s-${r.id}`, type: "studio", title: "สตูดิโอใหม่", subtitle: r.name, at: r.created_at })),
        ...(u.data ?? []).map((r): ActivityEvent => ({ id: `u-${r.id}`, type: "user", title: "สมาชิกใหม่", subtitle: r.display_name || "ไม่ระบุชื่อ", at: r.created_at })),
      ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 30);
      setEvents(evs);
    })();
  }, []);

  // realtime
  useEffect(() => {
    const ch = supabase
      .channel("admin-activity")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "projects" }, (p) => {
        const r = p.new as { id: string; title: string; created_at: string };
        const ev: ActivityEvent = { id: `p-${r.id}`, type: "project", title: "ผลงานใหม่", subtitle: r.title, at: r.created_at };
        setEvents((e) => [ev, ...e].slice(0, 50));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_posts" }, (p) => {
        const r = p.new as { id: string; title: string; created_at: string };
        const ev: ActivityEvent = { id: `j-${r.id}`, type: "job", title: "ประกาศงานใหม่", subtitle: r.title, at: r.created_at };
        setEvents((e) => [ev, ...e].slice(0, 50));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "hiring_requests" }, (p) => {
        const r = p.new as { id: string; project_title: string; client_name: string; created_at: string };
        const ev: ActivityEvent = { id: `h-${r.id}`, type: "hire", title: "คำขอจ้างงาน", subtitle: `${r.client_name} → ${r.project_title}`, at: r.created_at };
        setEvents((e) => [ev, ...e].slice(0, 50));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, (p) => {
        const r = p.new as { id: string; display_name: string; created_at: string };
        const ev: ActivityEvent = { id: `u-${r.id}`, type: "user", title: "สมาชิกใหม่", subtitle: r.display_name || "ไม่ระบุชื่อ", at: r.created_at };
        setEvents((e) => [ev, ...e].slice(0, 50));
      })

      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return events;
}
