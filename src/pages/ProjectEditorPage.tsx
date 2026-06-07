import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, ImagePlus, Loader2, Plus, Save, Trash2, Upload, X, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProject, useProject, useUpdateProject } from "@/hooks/useProjects";
import { uploadProjectImage } from "@/lib/uploadImage";
import { projectSchema, validateProjectPublish } from "@/lib/validators";
import { categories } from "@/data/projectTypes";
import { toast } from "sonner";
import StudioCreditPicker from "@/components/profile/StudioCreditPicker";
import LicensePicker from "@/components/license/LicensePicker";
import TagPicker from "@/components/tags/TagPicker";
import ToolPicker from "@/components/tools/ToolPicker";
import ProjectPreviewDialog, { type ProjectPreviewData } from "@/components/project/ProjectPreviewDialog";
import ThirdPartyAssetsToggle from "@/components/license/ThirdPartyAssetsToggle";
import OriginalWorkAttestation from "@/components/license/OriginalWorkAttestation";
import { type LicenseType, isLicenseType } from "@/lib/licenses";

type Status = "Published" | "Draft" | "Private";

const ProjectEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const editing = !!id;
  const { user, loading: authLoading } = useAuth();
  const folderRef = useRef<string>(id ?? crypto.randomUUID());

  const { data: existing } = useProject(id);
  const create = useCreateProject();
  const update = useUpdateProject();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Graphic");
  const [cover, setCover] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState<Status>("Draft");
  const [allowHire, setAllowHire] = useState(true);
  const [allowCollab, setAllowCollab] = useState(true);
  const [studioId, setStudioId] = useState<string | null>(null);
  const [creditedIds, setCreditedIds] = useState<string[]>([]);
  const [licenseType, setLicenseType] = useState<LicenseType>("all_rights");
  const [licenseNote, setLicenseNote] = useState("");
  const [copyrightHolder, setCopyrightHolder] = useState("");
  const [hasThirdPartyAssets, setHasThirdPartyAssets] = useState(false);
  const [thirdPartyNote, setThirdPartyNote] = useState("");
  const [rightsAttested, setRightsAttested] = useState(false);
  const [toolInput, setToolInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/portfolio/new");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSubtitle(existing.subtitle ?? "");
      setDescription(existing.description ?? "");
      setCategory(existing.category);
      setCover(existing.cover_url ?? "");
      setGallery(existing.gallery_urls ?? []);
      setTools(existing.tools ?? []);
      setTags(existing.tags ?? []);
      setPrice(existing.price_thb ? String(existing.price_thb) : "");
      setStatus(existing.status as Status);
      setAllowHire((existing as any).allow_hire ?? true);
      setAllowCollab((existing as any).allow_collab ?? true);
      setStudioId((existing as any).studio_id ?? null);
      setCreditedIds(((existing as any).credited_user_ids as string[]) ?? []);
      const lt = (existing as { license_type?: string }).license_type;
      setLicenseType(isLicenseType(lt ?? "") ? lt : "all_rights");
      setLicenseNote((existing as { license_note?: string }).license_note ?? "");
      setCopyrightHolder((existing as { copyright_holder?: string }).copyright_holder ?? "");
      setHasThirdPartyAssets((existing as { has_third_party_assets?: boolean }).has_third_party_assets ?? false);
      setThirdPartyNote((existing as { third_party_note?: string }).third_party_note ?? "");
      setRightsAttested(!!(existing as { rights_attested_at?: string | null }).rights_attested_at);
    }
  }, [existing]);

  const handleCover = async (file: File) => {
    if (!user) return;
    setUploadingCover(true);
    try {
      const url = await uploadProjectImage(file, user.id, folderRef.current);
      setCover(url);
      toast.success("อัปโหลดภาพปกสำเร็จ");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGallery = async (files: FileList | File[]) => {
    if (!user) return;
    const arr = Array.from(files);
    if (gallery.length + arr.length > 20) {
      toast.error("รวมแล้วต้องไม่เกิน 20 ภาพ");
      return;
    }
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const f of arr) {
        const u = await uploadProjectImage(f, user.id, folderRef.current);
        urls.push(u);
      }
      setGallery((prev) => [...prev, ...urls]);
      toast.success(`อัปโหลด ${urls.length} ภาพสำเร็จ`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploadingGallery(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    setGallery((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSubmit = async (publish?: boolean) => {
    if (!user) return;
    const targetStatus: Status = publish === undefined ? status : publish ? "Published" : "Draft";

    const rightsAttestedAt = rightsAttested ? new Date().toISOString() : null;

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      cover_url: cover,
      gallery_urls: gallery,
      tools,
      tags,
      price_thb: price ? Number(price) : null,
      status: targetStatus,
      allow_hire: allowHire,
      allow_collab: allowCollab,
      studio_id: studioId,
      credited_user_ids: studioId ? creditedIds : [],
      license_type: licenseType,
      license_note: licenseNote.trim(),
      has_third_party_assets: hasThirdPartyAssets,
      third_party_note: thirdPartyNote.trim(),
      copyright_holder: copyrightHolder.trim(),
      rights_attested_at: rightsAttestedAt,
    };

    const parsed = projectSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
      return;
    }
    if (targetStatus === "Published" && !cover) {
      toast.error("ต้องมีภาพปกก่อนเผยแพร่");
      return;
    }
    if (targetStatus === "Published" && !rightsAttested) {
      toast.error("กรุณายืนยันสิทธิ์ในผลงานก่อนเผยแพร่");
      return;
    }
    const publishErr = validateProjectPublish(parsed.data);
    if (publishErr) {
      toast.error(publishErr);
      return;
    }

    try {
      if (editing && id) {
        await update.mutateAsync({ id, patch: payload });
        toast.success("บันทึกการเปลี่ยนแปลงแล้ว");
        navigate(`/project/${id}`);
      } else {
        const created = await create.mutateAsync({ ...payload, owner_id: user.id });
        toast.success(targetStatus === "Published" ? "เผยแพร่ผลงานแล้ว" : "บันทึกฉบับร่างแล้ว");
        navigate(`/project/${created.id}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
    }
  };

  const cats = categories.filter((c) => c !== "Explore");
  const saving = create.isPending || update.isPending;

  const previewData: ProjectPreviewData = {
    title,
    subtitle,
    description,
    category,
    cover,
    gallery,
    tools,
    tags,
    price: price ? `฿${Number(price).toLocaleString("th-TH")}` : undefined,
    allowHire,
    allowCollab,
    licenseType,
    licenseNote,
    copyrightHolder,
    hasThirdPartyAssets,
    thirdPartyNote,
  };

  return (
    <div className="min-h-screen bg-app-ambient">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <h1 className="text-base font-semibold text-foreground ml-2">{editing ? "แก้ไขผลงาน" : "เพิ่มผลงานใหม่"}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shrink-0"
              onClick={() => setPreviewOpen(true)}
              aria-label="พรีวิวผลงาน"
              title="พรีวิวผลงาน"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSubmit(false)} disabled={saving} className="rounded-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
              บันทึกฉบับร่าง
            </Button>
            <Button size="sm" onClick={() => handleSubmit(true)} disabled={saving} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              เผยแพร่
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: content */}
        <div className="space-y-6">
          {/* Cover */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">ภาพปก *</Label>
            <CoverDrop url={cover} loading={uploadingCover} onPick={handleCover} onClear={() => setCover("")} />
            <p className="text-xs text-muted-foreground">ใช้เป็นภาพหลักในฟีดและการค้นหา (จะถูกบีบเป็น WebP คุณภาพ HD)</p>
          </section>

          {/* Title */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">ชื่อผลงาน *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น โลโก้ร้านกาแฟเชียงใหม่ Doi Brew"
              className="text-2xl font-medium h-14 px-4"
              maxLength={120}
            />
          </section>

          {/* Subtitle */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">คำโปรย</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="สรุปสั้นๆ ใน 1 ประโยค"
              maxLength={180}
            />
          </section>

          {/* Description */}
          <section className="space-y-2">
            <Label className="text-sm font-semibold">รายละเอียด</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`เล่าที่มา แนวคิด กระบวนการ และผลลัพธ์ของงานนี้...\n\nรองรับการเว้นบรรทัดเพื่อให้อ่านง่าย`}
              rows={8}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/5000</p>
          </section>

          {/* Gallery */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">แกลเลอรีรูปผลงาน ({gallery.length}/20)</Label>
              <GalleryAddButton disabled={uploadingGallery || gallery.length >= 20} onPick={handleGallery} />
            </div>

            {gallery.length === 0 ? (
              <GalleryDrop loading={uploadingGallery} onPick={handleGallery} />
            ) : (
              <div className="space-y-3">
                {gallery.map((src, i) => (
                  <div key={src + i} className="group relative rounded-2xl overflow-hidden border border-border bg-card">
                    <img src={src} alt={`ภาพที่ ${i + 1}`} className="w-full max-h-[600px] object-contain bg-muted/30" loading="lazy" />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                      <GripVertical className="w-3 h-3" /> ภาพที่ {i + 1}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => move(i, -1)} disabled={i === 0}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => move(i, 1)} disabled={i === gallery.length - 1}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full"
                        onClick={() => setGallery((p) => p.filter((_, j) => j !== i))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {uploadingGallery && (
                  <div className="rounded-2xl border border-dashed border-border bg-card p-8 flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> กำลังอัปโหลด...
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right: sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">หมวดงาน *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">การมองเห็น</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft — ฉบับร่าง</SelectItem>
                  <SelectItem value="Published">Published — เผยแพร่</SelectItem>
                  <SelectItem value="Private">Private — ส่วนตัว</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">ราคาเริ่มต้น (฿)</Label>
              <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="เช่น 3500" />
            </div>

            <div className="space-y-3 pt-2 border-t border-border/60">
              <LicensePicker
                value={licenseType}
                onChange={setLicenseType}
                licenseNote={licenseNote}
                onLicenseNoteChange={setLicenseNote}
                copyrightHolder={copyrightHolder}
                onCopyrightHolderChange={setCopyrightHolder}
              />
              <ThirdPartyAssetsToggle
                enabled={hasThirdPartyAssets}
                onEnabledChange={setHasThirdPartyAssets}
                note={thirdPartyNote}
                onNoteChange={setThirdPartyNote}
              />
              <OriginalWorkAttestation
                checked={rightsAttested}
                onCheckedChange={setRightsAttested}
                required={status === "Published"}
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-border/60">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">ปุ่มติดต่อในผลงานนี้</Label>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground">ปุ่ม "สนใจจ้างงาน"</p>
                  <p className="text-xs text-muted-foreground">ให้ผู้ชมส่งคำขอจ้างได้</p>
                </div>
                <Switch checked={allowHire} onCheckedChange={setAllowHire} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-foreground">ปุ่ม "อยากร่วมงานด้วย"</p>
                  <p className="text-xs text-muted-foreground">เปิดรับ Collab จากผู้ชม</p>
                </div>
                <Switch checked={allowCollab} onCheckedChange={setAllowCollab} />
              </div>
              {licenseType === "commercial_license" && !allowHire && (
                <p className="text-xs text-amber-600 bg-amber-500/10 rounded-lg px-3 py-2">
                  แนะนำเปิดปุ่ม &quot;สนใจจ้างงาน&quot; เพื่อให้ผู้ชมติดต่อซื้อสิทธิ์ได้ง่ายขึ้น
                </p>
              )}
            </div>
          </div>

          {user && (
            <StudioCreditPicker
              studioId={studioId}
              setStudioId={setStudioId}
              creditedIds={creditedIds}
              setCreditedIds={setCreditedIds}
              ownerId={user.id}
            />
          )}



          <ToolPicker
            userId={user?.id}
            tools={tools}
            onChange={setTools}
            input={toolInput}
            setInput={setToolInput}
          />
          <TagPicker
            userId={user?.id}
            tags={tags}
            onChange={setTags}
            input={tagInput}
            setInput={setTagInput}
          />
        </aside>
      </div>

      <ProjectPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
        ownerId={user?.id}
      />
    </div>
  );
};

/* ---------- subcomponents ---------- */

const CoverDrop = ({ url, loading, onPick, onClear }: { url: string; loading: boolean; onPick: (f: File) => void; onClear: () => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  if (url) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border group">
        <img src={url} alt="cover" className="w-full aspect-[16/9] object-cover" />
        <Button size="sm" variant="destructive" className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition" onClick={onClear}>
          <X className="w-4 h-4 mr-1" /> ลบภาพปก
        </Button>
      </div>
    );
  }
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files?.[0]; if (f) onPick(f);
      }}
      onClick={() => ref.current?.click()}
      className={`rounded-2xl border-2 border-dashed cursor-pointer transition aspect-[16/9] flex flex-col items-center justify-center gap-2 ${
        drag ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"
      }`}
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <ImagePlus className="w-8 h-8 text-muted-foreground" />}
      <p className="text-sm font-medium text-foreground">ลากภาพมาวาง หรือคลิกเพื่อเลือก</p>
      <p className="text-xs text-muted-foreground">JPG / PNG / WebP — สูงสุด 5MB</p>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])} />
    </div>
  );
};

const GalleryDrop = ({ loading, onPick }: { loading: boolean; onPick: (f: FileList) => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files?.length) onPick(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`rounded-2xl border-2 border-dashed cursor-pointer p-10 flex flex-col items-center justify-center gap-2 transition ${
        drag ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"
      }`}
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-8 h-8 text-muted-foreground" />}
      <p className="text-sm font-medium text-foreground">ลากภาพหลายไฟล์มาวาง หรือคลิกเพื่อเลือก</p>
      <p className="text-xs text-muted-foreground">เพิ่มได้สูงสุด 20 ภาพ — เรียงลำดับได้ภายหลัง</p>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && onPick(e.target.files)} />
    </div>
  );
};

const GalleryAddButton = ({ disabled, onPick }: { disabled: boolean; onPick: (f: FileList) => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button size="sm" variant="outline" className="rounded-full" disabled={disabled} onClick={() => ref.current?.click()}>
        <Plus className="w-4 h-4 mr-1" /> เพิ่มภาพ
      </Button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) onPick(e.target.files); e.target.value = ""; }} />
    </>
  );
};

export default ProjectEditorPage;
