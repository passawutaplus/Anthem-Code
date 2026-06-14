import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageLoader from "@/components/ui/PageLoader";
import { useCommunityPost } from "@/hooks/useCommunityPosts";
import CommunityCommentSection from "@/components/community/CommunityCommentSection";
import { formatThaiDate } from "@/lib/format";
import Footer from "@/components/Footer";

const CommunityPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useCommunityPost(id);

  if (isLoading) return <PageLoader label="กำลังโหลด..." />;
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">ไม่พบโพสต์</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-app-ambient pb-24">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> กลับ
        </button>
        <article className="rounded-2xl glass-panel p-6 space-y-4">
          <Badge variant="secondary" className="rounded-full">{post.post_kind === "tip" ? "Tips" : "Q&A"}</Badge>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {post.profile?.display_name} · {formatThaiDate(post.created_at)}
            {post.category ? ` · ${post.category}` : ""}
          </p>
          <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{post.body}</p>
        </article>
        <CommunityCommentSection postId={post.id} />
      </div>
      <Footer />
    </main>
  );
};

export default CommunityPostDetailPage;
