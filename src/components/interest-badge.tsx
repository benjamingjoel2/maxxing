import { INTEREST_LABELS, type Interest } from "@/lib/types";

const TONES: Record<Interest, string> = {
  art: "bg-[#f3d9e0] text-[#7a2440] dark:bg-[#3a1c26] dark:text-[#f0b8c8]",
  architecture: "bg-[#dfe6ee] text-[#2d4560] dark:bg-[#1f2b38] dark:text-[#b9cbe0]",
  history: "bg-[#e9dfcf] text-[#5b452a] dark:bg-[#2f261a] dark:text-[#d9c39f]",
  food: "bg-[#f8dccb] text-[#8a3a1a] dark:bg-[#3d2216] dark:text-[#f2b898]",
  music: "bg-[#e3dcf3] text-[#4a3480] dark:bg-[#271e3a] dark:text-[#c8bbea]",
  performance: "bg-[#f6e3c8] text-[#7a4a12] dark:bg-[#3a2a14] dark:text-[#eac48a]",
  literature: "bg-[#e6e3d7] text-[#4b4a3a] dark:bg-[#2b2a22] dark:text-[#cfcbb5]",
  film: "bg-[#dcdcdc] text-[#333] dark:bg-[#2a2a2a] dark:text-[#cfcfcf]",
  craft: "bg-[#dde8dc] text-[#2f5230] dark:bg-[#1c2c1c] dark:text-[#b6d1b4]",
  festivals: "bg-[#fbe6b8] text-[#7a5a0a] dark:bg-[#3b2f0f] dark:text-[#ecd08a]",
};

export function InterestBadge({ interest, size = "sm" }: { interest: Interest; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${TONES[interest]} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
    >
      {INTEREST_LABELS[interest]}
    </span>
  );
}
