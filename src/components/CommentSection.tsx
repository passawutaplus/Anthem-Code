import { useState } from "react";
import { MessageCircle, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useCreateComment, useDeleteComment, useProjectComments } from "@/hooks/useProjectComments";
import { commentSchema } from "@/lib/validators";
import { toast } from "sonner";
import { formatThaiDate } from "@/lib/format";
import { useAuthDialog } from "@/stores/authDialogStore";
import ReportTrigger from "@/components/report/ReportTrigger";

interface Props {
  projectId: string | undefined;
}

const CommentSection = ({ projectId }: Props) => {
  const { user } = useAuth();
  const openAuth = useAuthDialog((s) => s.openSignup);
  const [text, setText] = useState("");
  const { data: comments = [], isLoading } = useProjectComments(projectId);
  const createMut = useCreateComment();
  const deleteMut = useDeleteComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectId) return;
    const parsed = commentSchema.safeParse({ content: text });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "ข้อความไม่ถูกต้อง");
      return;
    }
    try {
      await createMut.mutateAsync({ project_id: projectId, user_id: user.id, content: parsed.data.content });
      setText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "คอมเมนต์ไม่สำเร็จ");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        ความคิดเห็น {comments.length > 0 && <span className="text-muted-foreground text-sm font-normal">({comments.length})</span>}
      </h2>

      {!user ? (
        <div className="rounded-2xl glass-panel p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">เข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็น</p>
          <Button
            onClick={openAuth}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl glass-panel p-4 space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="แชร์ความคิดเห็นเกี่ยวกับผลงานนี้..."
            rows={3}
            maxLength={800}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{text.length}/800</span>
            <Button
              type="submit"
              disabled={createMut.isPending || !text.trim()}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              <Send className="w-4 h-4 mr-1" />
              {createMut.isPending ? "กำลังส่ง..." : "ส่งคอมเมนต์"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">กำลังโหลด...</p>}
        {!isLoading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มีคอมเมนต์ — มาเป็นคนแรกกันเถอะ</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="rounded-2xl glass-panel p-4 flex gap-3">
            {c.profile?.avatar_url ? (
              <img src={c.profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                {(c.profile?.display_name ?? "?")[0]}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">{c.profile?.display_name ?? "ผู้ใช้"}</p>
                <span className="text-xs text-muted-foreground">{formatThaiDate(c.created_at)}</span>
                {user?.id === c.user_id ? (
                  <button
                    onClick={() => deleteMut.mutate({ id: c.id, project_id: c.project_id })}
                    className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="ลบคอมเมนต์"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  user && (
                    <ReportTrigger
                      targetType="comment"
                      targetId={c.id}
                      targetOwnerId={c.user_id}
                      className="ml-auto"
                    />
                  )
                )}
              </div>
              <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap break-words">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommentSection;
