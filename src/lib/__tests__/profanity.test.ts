import { describe, expect, it } from "vitest";
import { detectProfanity, maskProfanity } from "@/lib/profanity";

describe("profanity", () => {
  it("detects english vulgar words", () => {
    expect(detectProfanity("what the fuck").hasProfanity).toBe(true);
  });

  it("detects thai vulgar words", () => {
    expect(detectProfanity("ไอ้สัส").hasProfanity).toBe(true);
  });

  it("allows clean text", () => {
    expect(detectProfanity("สวัสดีครับ รับงาน branding").hasProfanity).toBe(false);
  });

  it("masks profanity", () => {
    expect(maskProfanity("fuck you")).toBe("*** you");
  });
});
