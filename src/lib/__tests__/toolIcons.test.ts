import { describe, expect, it } from "vitest";
import { resolveToolIconSlug, toolIconUrl } from "@/lib/toolIcons";

describe("toolIcons", () => {
  it("builds theSVG CDN URLs", () => {
    expect(toolIconUrl("figma")).toBe("https://thesvg.org/icons/figma/default.svg");
    expect(toolIconUrl("tailwind-css")).toBe("https://thesvg.org/icons/tailwind-css/default.svg");
  });

  it("maps common tool names to theSVG slugs", () => {
    expect(resolveToolIconSlug("Photoshop")).toBe("photoshop");
    expect(resolveToolIconSlug("Adobe Illustrator")).toBe("illustrator");
    expect(resolveToolIconSlug("After Effects")).toBe("after-effects");
    expect(resolveToolIconSlug("Tailwind CSS")).toBe("tailwind-css");
    expect(resolveToolIconSlug("VS Code")).toBe("visual-studio-code");
    expect(resolveToolIconSlug("Stable Diffusion")).toBe("stability-ai");
  });

  it("still resolves tools missing from theSVG catalog for letter fallback", () => {
    expect(resolveToolIconSlug("Procreate")).toBe("procreate");
    expect(resolveToolIconSlug("InVision")).toBe("invision");
  });
});
