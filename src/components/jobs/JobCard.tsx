import BriefcaseIcon from "../icons/BriefcaseIcon";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, UserSearch } from "lucide-react";
import type { JobPost } from "@/hooks/useJobs";

const fmtBudget = (j: JobPost) => {
  const unit = j.budget_type === "hourly" ? "/ชม." : j.budget_type === "monthly" ? "/เดือน" : "";
  if (j.budget_min && j.budget_max) return `฿${j.budget_min.toLocaleString()} - ${j.budget_max.toLocaleString()}${unit}`;
  if (j.budget_min) return `฿${j.budget_min.toLocaleString()}+${unit}`;
  if (j.budget_max) return `ถึง ฿${j.budget_max.toLocaleString()}${unit}`;
  return "ตามตกลง";
};

const locTypeLabel: Record<JobPost["location_type"], string> = {
  remote: "Remote",
  onsite: "Onsite",
  hybrid: "Hybrid",
};

const empLabel: Record<JobPost["employment_type"], string> = {
  project: "Project",
  fulltime: "Full-time",
  parttime: "Part-time",
  internship: "Internship",
};

interface Props {
  job: JobPost;
  compact?: boolean;
  onClick?: () => void;
}

const JobCard = ({ job, compact, onClick }: Props) => {
  const isSeeking = job.post_type === "seeking";
  const headerName = job.studio?.name ?? job.poster?.display_name ?? "ผู้ใช้";
  const headerAvatar = job.studio?.avatar_url ?? job.poster?.avatar_url ?? undefined;
  const content = (
    <div className="glass-panel rounded-2xl p-4 hover:shadow-md hover:shadow-primary/10 transition-all cursor-pointer group h-full">
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10 rounded-xl">
          <AvatarImage src={headerAvatar} />
          <AvatarFallback className="bg-gradient-brand text-white rounded-xl">
            {isSeeking ? <UserSearch className="w-4 h-4" /> : <BriefcaseIcon className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{headerName}</span>
            {job.studio?.verified && <span className="text-primary">✓</span>}
            {isSeeking && (
              <Badge className="ml-1 bg-primary/15 text-primary border-0 text-[10px] h-4 px-1.5">หางาน</Badge>
            )}
          </div>
          <h3 className="font-medium tracking-tight thai-display text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
        </div>
      </div>

      {!compact && job.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-2.5 thai-body">{job.description}</p>
      )}

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {job.skills.slice(0, compact ? 2 : 4).map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] py-0 px-1.5 h-5 font-normal">{s}</Badge>
          ))}
          {job.skills.length > (compact ? 2 : 4) && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-5 font-normal">
              +{job.skills.length - (compact ? 2 : 4)}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40 text-xs">
        <span className="font-medium text-primary">{fmtBudget(job)}</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-[10px] uppercase tracking-wide">{empLabel[job.employment_type]}</span>
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {locTypeLabel[job.location_type]}</span>
          {!isSeeking && (
            <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {job.applicants_count}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) return <button onClick={onClick} className="text-left w-full">{content}</button>;
  return <Link to={`/jobs/${job.id}`} className="block">{content}</Link>;
};

export default JobCard;
