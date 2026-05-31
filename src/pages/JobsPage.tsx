import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOpenJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { requireAuth } from "@/lib/requireAuth";
import JobCard from "@/components/jobs/JobCard";
import JobPostDialog from "@/components/jobs/JobPostDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowLeft, UserSearch, SlidersHorizontal, X, FileSignature, Crown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const LOCATION_CHIPS = [
  { v: "all", label: "ทั้งหมด" },
  { v: "remote", label: "Remote" },
  { v: "onsite", label: "Onsite" },
  { v: "hybrid", label: "Hybrid" },
];

const EMPLOYMENT_CHIPS = [
  { v: "all", label: "ทุกประเภท" },
  { v: "project", label: "Project" },
  { v: "fulltime", label: "Full-time" },
  { v: "parttime", label: "Part-time" },
  { v: "internship", label: "Internship" },
];

const POSTER_CHIPS = [
  { v: "all", label: "ทุกผู้โพสต์" },
  { v: "studio", label: "Studio" },
  { v: "company", label: "Company" },
  { v: "freelancer", label: "Freelancer" },
];

const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"hiring" | "seeking">("hiring");
  const { data: jobs = [], isLoading } = useOpenJobs({ postType: mode });
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("all");
  const [emp, setEmp] = useState("all");
  const [poster, setPoster] = useState("all");
  const [roleCat, setRoleCat] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const roleCategories = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.role_category && set.add(j.role_category));
    return ["all", ...Array.from(set).sort()];
  }, [jobs]);

  const activeFilterCount =
    (loc !== "all" ? 1 : 0) + (emp !== "all" ? 1 : 0) + (poster !== "all" ? 1 : 0) + (roleCat !== "all" ? 1 : 0);

  const filtered = jobs.filter((j) => {
    const matchLoc = loc === "all" || j.location_type === loc;
    const matchEmp = emp === "all" || j.employment_type === emp;
    const matchPoster = poster === "all" || j.poster_role === poster;
    const matchRole = roleCat === "all" || j.role_category === roleCat;
    const q = search.trim().toLowerCase();
    const matchSearch = !q
      || j.title.toLowerCase().includes(q)
      || j.skills.some((s) => s.toLowerCase().includes(q))
      || j.studio?.name.toLowerCase().includes(q)
      || j.poster?.display_name?.toLowerCase().includes(q);
    return matchLoc && matchEmp && matchPoster && matchRole && matchSearch;
  });

  return (
    <div className="min-h-screen bg-app-ambient pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full glass-chip grid place-items-center"
            aria-label="กลับหน้าแรก"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {mode === "hiring" ? <BriefcaseIcon className="w-7 h-7 text-primary shrink-0" /> : <UserSearch className="w-7 h-7 text-primary shrink-0" />}
          <div className="flex-1">
            <h1 className="text-2xl font-medium tracking-tight thai-display">
              {mode === "hiring" ? "บอร์ดหางาน" : "ผู้กำลังหางาน"}
            </h1>
            <p className="text-xs text-muted-foreground thai-body">
              {mode === "hiring" ? "หาฟรีแลนซ์/พนักงาน — เปิดให้ทุกคนประกาศ" : "ดู CV และพอร์ตของคนที่กำลังหางาน"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => requireAuth(user, () => navigate("/contracts/new"))}
              variant="outline"
              className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 gap-1.5"
              title="ให้ AI ช่วยร่างสัญญาจ้างงาน"
            >
              <FileSignature className="w-4 h-4" />
              <span className="hidden sm:inline">ร่างสัญญา</span>
              <Crown className="w-3 h-3 opacity-70" />
            </Button>
            <Button
              onClick={() => requireAuth(user, () => setDialogOpen(true))}
              className="rounded-xl bg-gradient-brand text-white border-0"
            >
              <Plus className="w-4 h-4 mr-1.5" /> ลงประกาศ
            </Button>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 p-1 glass-panel rounded-full w-full sm:w-fit">
          <button
            onClick={() => setMode("hiring")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1.5",
              mode === "hiring" ? "bg-gradient-brand text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BriefcaseIcon className="w-4 h-4" /> หาคน/พนักงาน
          </button>
          <button
            onClick={() => setMode("seeking")}
            className={cn(
              "flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1.5",
              mode === "seeking" ? "bg-gradient-brand text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserSearch className="w-4 h-4" /> หางาน/CV
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={mode === "hiring" ? "ค้นหาตำแหน่ง, ทักษะ, ผู้ลงประกาศ" : "ค้นหาตำแหน่ง, ทักษะ, ชื่อผู้สมัคร"}
                className="pl-9 h-10 rounded-xl border-0 bg-background/60"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "h-10 px-3 rounded-xl glass-chip flex items-center gap-1.5 text-sm relative",
                    activeFilterCount > 0 && "text-primary"
                  )}
                  aria-label="ตัวกรอง"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">ตัวกรอง</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium grid place-items-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[300px] p-4 space-y-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">ตัวกรอง</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setLoc("all"); setEmp("all"); setPoster("all"); setRoleCat("all"); }}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> ล้าง
                    </button>
                  )}
                </div>

                {[
                  { key: "loc", title: "สถานที่", val: loc, set: setLoc, chips: LOCATION_CHIPS },
                  { key: "emp", title: "ประเภทการจ้าง", val: emp, set: setEmp, chips: EMPLOYMENT_CHIPS },
                  { key: "poster", title: "ผู้โพสต์", val: poster, set: setPoster, chips: POSTER_CHIPS },
                ].map((row) => (
                  <div key={row.key} className="space-y-1.5">
                    <p className="text-[11px] text-muted-foreground">{row.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {row.chips.map((c) => (
                        <button
                          key={c.v}
                          onClick={() => row.set(c.v)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                            row.val === c.v
                              ? "bg-gradient-brand text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {roleCategories.length > 1 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-muted-foreground">หมวดหมู่งาน</p>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {roleCategories.map((c) => (
                        <button
                          key={c}
                          onClick={() => setRoleCat(c)}
                          className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                            roleCat === c
                              ? "bg-gradient-brand text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {c === "all" ? "ทั้งหมด" : c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-panel rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl">
            <BriefcaseIcon className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-foreground font-medium thai-display">
              {mode === "hiring" ? "ยังไม่มีประกาศงาน" : "ยังไม่มีผู้ประกาศหางาน"}
            </p>
            <p className="text-sm text-muted-foreground mt-1 thai-body">ลองเปลี่ยนตัวกรองหรือเป็นคนแรกที่ลงประกาศ</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        )}
      </div>
      <Footer />
      <JobPostDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultMode={mode} />
    </div>
  );
};

export default JobsPage;
