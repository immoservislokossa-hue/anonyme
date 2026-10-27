import { isFormat, type Format } from "@/lib/stories";

export const FORMAT_KEY = "format-v1";

// Le format préféré reste sur l'appareil, comme la progression.
export function parseFormat(raw: string | null): Format | null {
  return isFormat(raw) ? raw : null;
}
