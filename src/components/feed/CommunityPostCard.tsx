import { Link } from "react-router-dom";
import { MessageCircle, Lightbulb, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CommunityPost } from "@/hooks/useCommunityPosts";
import { formatThaiDate } from "@/lib/format";

interface Props {
  post: CommunityPost;
}

const CommunityPostCard = ({ post }: Props) => {
  const isTip = post.post_kind === "tip";
  return (
    <Link
      to={`/community/${post.id}`}
      className="block rounded-2xl glass-panel p-4 hover:ring-2 hover:ring-primary/20 transition-all"
    >
      <div className="flex items-start gap-3">
        {post.profile?.avatar_url ? (
          <img src={post.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-medium text-primary shrink-0">
            {(post.profile?.display_name ?? "?")[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="secondary" className="rounded-full text-[10px] gap-1">
              {isTip ? <Lightbulb className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
              {isTip ? "Tips" : "Q&A"}
            </Badge>
            {post.category && (
              <span className="text-[10px] text-muted-foreground">{post.category}</span>
            )}
          </div>
          <h3 className="font-medium text-foreground line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.body}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{post.profile?.display_name ?? "ผู้ใช้"}</span>
            <span>{formatThaiDate(post.created_at)}</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {post.reply_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityPostCard;
