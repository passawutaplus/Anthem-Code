import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLicenseMeta } from "@/lib/licenses";
import { LicenseBadgeInline } from "@/components/license/LicenseBadge";
import { Check, X, Minus } from "lucide-react";

interface Props {
  licenseType?: string | null;
  licenseNote?: string | null;
  copyrightHolder?: string | null;
  ownerName?: string;
  hasThirdPartyAssets?: boolean;
  thirdPartyNote?: string | null;
  allowHire?: boolean;
  onHire?: () => void;
}

const BoolRow = ({ label, value }: { label: string; value: boolean | "partial" }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    {value === true ? (
      <span className="flex items-center gap-1 text-emerald-600"><Check className="w-3.5 h-3.5" /> ได้</span>
    ) : value === "partial" ? (
      <span className="flex items-center gap-1 text-amber-600"><Minus className="w-3.5 h-3.5" /> ติดต่อเจ้าของ</span>
    ) : (
      <span className="flex items-center gap-1 text-muted-foreground"><X className="w-3.5 h-3.5" /> ไม่ได้</span>
    )}
  </div>
);

const LicenseDetailBlock = ({
  licenseType,
  licenseNote,
  copyrightHolder,
  ownerName,
  hasThirdPartyAssets,
  thirdPartyNote,
  allowHire,
  onHire,
}: Props) => {
  const meta = getLicenseMeta(licenseType);
  const holder = copyrightHolder?.trim() || ownerName || "เจ้าของผลงาน";
  const commercialValue = meta.allowsCommercial ? true : meta.id === "commercial_license" || meta.id === "attribution_ok" ? "partial" : false;

  return (
    <div className="rounded-2xl glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">สิทธิ์การใช้งาน</h3>
        <LicenseBadgeInline licenseType={licenseType} />
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">
        {licenseType === "custom" && licenseNote?.trim() ? licenseNote.trim() : meta.detailParagraph}
      </p>

      <div className="space-y-2 pt-2 border-t border-border/50">
        <p className="text-xs text-muted-foreground">เจ้าของลิขสิทธิ์: <span className="text-foreground">{holder}</span></p>
        <BoolRow label="นำไปใช้ซ้ำ" value={meta.allowsReuse} />
        <BoolRow label="ใช้เชิงพาณิชย์" value={commercialValue} />
        <BoolRow label="ต้องอ้างอิงเครดิต" value={meta.requiresAttribution} />
      </div>

      {hasThirdPartyAssets && thirdPartyNote?.trim() && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-2">
          มี asset จากที่อื่น: {thirdPartyNote.trim()}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {(meta.allowsCommercial || meta.id === "commercial_license") && (allowHire ?? true) && onHire && (
          <Button size="sm" className="rounded-full" onClick={onHire}>
            อยากใช้งานนี้? ติดต่อจ้าง
          </Button>
        )}
        <Link to="/legal/ip" className="text-xs text-primary hover:underline">
          เรียนรู้เรื่องลิขสิทธิ์
        </Link>
      </div>
    </div>
  );
};

export default LicenseDetailBlock;
