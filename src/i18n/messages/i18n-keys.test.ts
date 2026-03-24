import { describe, it, expect } from "vitest";
import en from "./en.json";
import zh from "./zh.json";

function getAllKeys(
  obj: Record<string, unknown>,
  prefix = ""
): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      return getAllKeys(value as Record<string, unknown>, fullKey);
    }
    return [fullKey];
  });
}

describe("i18n key alignment", () => {
  const enKeys = getAllKeys(en).sort();
  const zhKeys = getAllKeys(zh).sort();

  it("en.json and zh.json should have the same keys", () => {
    expect(enKeys).toEqual(zhKeys);
  });

  it("en.json keys missing from zh.json", () => {
    const missing = enKeys.filter((k) => !zhKeys.includes(k));
    expect(missing).toEqual([]);
  });

  it("zh.json keys missing from en.json", () => {
    const extra = zhKeys.filter((k) => !enKeys.includes(k));
    expect(extra).toEqual([]);
  });
});
