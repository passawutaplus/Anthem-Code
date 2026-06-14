import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCreateCommunityPost } from "@/hooks/useCommunityPosts";
import { communityPostSchema } from "@/lib/validators";
import { categories } from "@/data/projectTypes";
import { toast } from "sonner";
import ModerationBanBanner from "@/components/moderation/ModerationBanBanner";
import Footer from "@/components/Footer";

const TOPIC_CATEGORIES = categories.filter((c) => c !== "Explore");

const CommunityPostEditorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const create = useCreateCommunityPost();
  const [postKind, setPostKind] = useState<"tip" | "question">("tip");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(TOPIC_CATEGORIES[0] ?? "Graphic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = communityPostSchema.safeParse({ postKind, title, body, category });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
      return;
    }
    try {
      const { id } = await create.mutateAsync({
        author_id: user.id,
        post_kind: parsed.data.postKind,
        title: parsed.data.title,
        body: parsed.data.body,
        category: parsed.data.category,
      });
      toast.success("โพสต์สำเร็จ");
      navigate(`/community/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "โพสต์ไม่สำเร็จ");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => navigate("/auth")}>เข้าสู่ระบบเพื่อโพสต์</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-app-ambient pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> กลับ
        </button>
        <h1 className="text-2xl font-semibold mb-4">โพสต์ชุมชน</h1>
        <ModerationBanBanner className="mb-4" />
        <form onSubmit={handleSubmit} className="rounded-2xl glass-panel p-6 space-y-4">
          <div className="flex gap-2">
            {(["tip", "question"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPostKind(k)}
                className={`px-4 py-2 rounded-full text-sm ${postKind === k ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {k === "tip" ? "Tips" : "Q&A"}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium">หมวด</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm"
            >
              {TOPIC_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">หัวข้อ</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              className="mt-1 w-full rounded-xl bg-secondary border border-border px-3 py-2 text-sm"
              placeholder="หัวข้อโพสต์"
            />
          </div>
          <div>
            <label className="text-sm font-medium">เนื้อหา</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} maxLength={3000} placeholder="แชร์เทคนิค หรือถามคำถาม..." />
          </div>
          <Button type="submit" disabled={create.isPending} className="rounded-full w-full">
            {create.isPending ? "กำลังโพสต์..." : "เผยแพร่"}
          </Button>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default CommunityPostEditorPage;
