import type { Ratio } from "./allocate";

const RATIO_KEY = "studyTime.ratio";
const LEISURE_KEY = "studyTime.leisure";

export const DEFAULT_RATIO: Ratio = { law: 8, work: 2 };

export type Leisure = { hours: number; minutes: number };

function read<T>(key: string, isValid: (v: unknown) => v is T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value: unknown = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    // プライベートブラウズ等で使えない・中身が壊れている場合は初期値
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 保存できなくてもアプリは動かす
  }
}

const isNonNegInt = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;

function isRatio(v: unknown): v is Ratio {
  const r = v as Ratio;
  return typeof v === "object" && v !== null && isNonNegInt(r.law) && isNonNegInt(r.work) && r.law + r.work > 0;
}

function isLeisure(v: unknown): v is Leisure {
  const l = v as Leisure;
  return typeof v === "object" && v !== null && isNonNegInt(l.hours) && isNonNegInt(l.minutes) && l.minutes < 60;
}

export const loadRatio = () => read(RATIO_KEY, isRatio, DEFAULT_RATIO);
export const saveRatio = (r: Ratio) => write(RATIO_KEY, r);
export const loadLeisure = () => read<Leisure | null>(LEISURE_KEY, (v): v is Leisure | null => isLeisure(v), null);
export const saveLeisure = (l: Leisure) => write(LEISURE_KEY, l);
