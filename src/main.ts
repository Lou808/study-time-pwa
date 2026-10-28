import "./style.css";
import { allocate, formatMinutes, toMinutes, type Ratio } from "./allocate";
import { DEFAULT_RATIO, loadLeisure, loadRatio, saveLeisure, saveRatio } from "./storage";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const hoursInput = $<HTMLInputElement>("hours");
const minutesInput = $<HTMLInputElement>("minutes");
const ratioLawInput = $<HTMLInputElement>("ratio-law");
const ratioWorkInput = $<HTMLInputElement>("ratio-work");
const lawResult = $("law-result");
const workResult = $("work-result");
const ratioNote = $("ratio-note");
const errorText = $("error");

let ratio: Ratio = loadRatio();

/** 空欄は0、数字以外は NaN として扱う */
function readInt(input: HTMLInputElement): number {
  const text = input.value.trim();
  if (text === "") return 0;
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

function validateLeisure(hours: number, minutes: number): string | null {
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "0以上の整数で入力してください";
  if (minutes > 59) return "分は0〜59で入力してください";
  if (toMinutes(hours, minutes) > 24 * 60) return "余暇時間は24時間以内で入力してください";
  return null;
}

function render(): void {
  const hours = readInt(hoursInput);
  const minutes = readInt(minutesInput);
  const error = validateLeisure(hours, minutes);

  errorText.hidden = error === null;
  errorText.textContent = error ?? "";
  ratioNote.textContent = `比率 法学 ${ratio.law} : 仕事の勉強 ${ratio.work}`;

  if (error) {
    lawResult.textContent = "—";
    workResult.textContent = "—";
    return;
  }

  const { lawMinutes, workMinutes } = allocate(toMinutes(hours, minutes), ratio);
  lawResult.textContent = formatMinutes(lawMinutes);
  workResult.textContent = formatMinutes(workMinutes);
  saveLeisure({ hours, minutes });
}

function onRatioInput(): void {
  const law = readInt(ratioLawInput);
  const work = readInt(ratioWorkInput);
  // 不正な比率（両方0など）は保存せず、前回の比率のまま計算する
  if (Number.isNaN(law) || Number.isNaN(work) || law + work === 0) return;
  ratio = { law, work };
  saveRatio(ratio);
  render();
}

function setRatioInputs(r: Ratio): void {
  ratioLawInput.value = String(r.law);
  ratioWorkInput.value = String(r.work);
}

// ＋／− ボタン：時間は0〜24、分は0〜55を行き来する
document.querySelectorAll<HTMLButtonElement>(".step").forEach((button) => {
  button.addEventListener("click", () => {
    const input = $<HTMLInputElement>(button.dataset.target!);
    const max = Number(input.max);
    const current = readInt(input) || 0;
    const next = Math.min(max, Math.max(0, current + Number(button.dataset.delta)));
    input.value = String(next);
    render();
  });
});

hoursInput.addEventListener("input", render);
minutesInput.addEventListener("input", render);
ratioLawInput.addEventListener("input", onRatioInput);
ratioWorkInput.addEventListener("input", onRatioInput);

// 入力欄をタップしたら中身を選択して、すぐ打ち直せるようにする
for (const input of [hoursInput, minutesInput, ratioLawInput, ratioWorkInput]) {
  input.addEventListener("focus", () => input.select());
}

$("ratio-reset").addEventListener("click", () => {
  ratio = { ...DEFAULT_RATIO };
  saveRatio(ratio);
  setRatioInputs(ratio);
  render();
});

// 起動時：保存済みの値を復元
const saved = loadLeisure();
if (saved) {
  hoursInput.value = String(saved.hours);
  minutesInput.value = String(saved.minutes);
}
setRatioInputs(ratio);
render();
