export type Ratio = { law: number; work: number };

export type Allocation = { lawMinutes: number; workMinutes: number };

/** 余暇時間（分）を比率で配分する。合計は必ず totalMinutes と一致する。 */
export function allocate(totalMinutes: number, ratio: Ratio): Allocation {
  const sum = ratio.law + ratio.work;
  if (totalMinutes <= 0 || sum <= 0) return { lawMinutes: 0, workMinutes: 0 };

  // 法学側だけ四捨五入し、仕事側は残りにすることで合計を一致させる
  const lawMinutes = Math.round((totalMinutes * ratio.law) / sum);
  return { lawMinutes, workMinutes: totalMinutes - lawMinutes };
}

export function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

/** 135 → "2時間15分" */
export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}時間${m}分`;
}
