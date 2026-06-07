import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  required?: boolean;
}

const OriginalWorkAttestation = ({ checked, onCheckedChange, required }: Props) => (
  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
    <Checkbox
      id="rights-attest"
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      className="mt-0.5"
    />
    <Label htmlFor="rights-attest" className="text-xs leading-relaxed text-foreground/90 cursor-pointer">
      ฉันยืนยันว่าผลงานนี้เป็นของฉัน หรือฉันได้รับอนุญาตให้เผยแพร่บน Anthem แล้ว
      {required && <span className="text-destructive"> *</span>}
      {" "}
      <Link to="/legal/ip" target="_blank" className="text-primary hover:underline">
        อ่านเพิ่มเติม
      </Link>
    </Label>
  </div>
);

export default OriginalWorkAttestation;
