import { describe, expect, it } from "vitest";
import { formatMoney, formatRating, formatWait } from "./format";

describe("formatMoney", () => {
  it("renders whole DKK amounts without decimals", () => {
    expect(formatMoney(8900)).toBe("89 DKK");
    expect(formatMoney(12900)).toBe("129 DKK");
  });

  it("keeps two decimals for fractional amounts", () => {
    expect(formatMoney(8950)).toBe("89.50 DKK");
  });

  it("honours the currency argument", () => {
    expect(formatMoney(1000, "EUR")).toBe("10 EUR");
  });
});

describe("formatRating", () => {
  it("shows a dash when there is no rating", () => {
    expect(formatRating(null)).toBe("–");
    expect(formatRating(undefined)).toBe("–");
  });

  it("always shows one decimal place", () => {
    expect(formatRating(4)).toBe("4.0");
    expect(formatRating(4.35)).toBe("4.3");
  });
});

describe("formatWait", () => {
  it("handles missing and zero waits", () => {
    expect(formatWait(null)).toBe("–");
    expect(formatWait(0)).toBe("No wait");
  });

  it("prefixes a real wait with a tilde", () => {
    expect(formatWait(10)).toBe("~10 min");
  });
});
