import { describe, expect, it } from "vitest";
import { allocate, formatMinutes, toMinutes } from "./allocate";

describe("allocate", () => {
  it("8:2 で割り切れる場合", () => {
    expect(allocate(300, { law: 8, work: 2 })).toEqual({ lawMinutes: 240, workMinutes: 60 });
  });

  it("端数が出ても合計が一致する", () => {
    for (let total = 0; total <= 24 * 60; total++) {
      const { lawMinutes, workMinutes } = allocate(total, { law: 7, work: 3 });
      expect(lawMinutes + workMinutes).toBe(total);
    }
  });

  it("端数は四捨五入される", () => {
    // 7分 × 0.8 = 5.6 → 6分
    expect(allocate(7, { law: 8, work: 2 })).toEqual({ lawMinutes: 6, workMinutes: 1 });
  });

  it("比率が片方0なら全部片方へ", () => {
    expect(allocate(90, { law: 0, work: 5 })).toEqual({ lawMinutes: 0, workMinutes: 90 });
  });

  it("比率の合計が0なら0分", () => {
    expect(allocate(90, { law: 0, work: 0 })).toEqual({ lawMinutes: 0, workMinutes: 0 });
  });
});

describe("format", () => {
  it("分を ○時間○分 にする", () => {
    expect(formatMinutes(135)).toBe("2時間15分");
    expect(formatMinutes(45)).toBe("0時間45分");
    expect(toMinutes(2, 15)).toBe(135);
  });
});
