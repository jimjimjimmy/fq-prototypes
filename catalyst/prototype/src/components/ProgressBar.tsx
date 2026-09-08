import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface ProgressBarProps {
  /** Percent 0–100 */
  targetProgress?: number;
  remainingCount?: number;
  /** Optional: delay to sync with card entrance animation */
  delayMs?: number;
}

export function ProgressBar({
  targetProgress = 50.36,
  remainingCount = 4,
  delayMs = 350,
}: ProgressBarProps) {
  const reduceMotion = useReducedMotion();

  // Clamp + sanitize so animation never silently fails
  const safeTarget = Number.isFinite(targetProgress)
    ? Math.max(0, Math.min(100, targetProgress))
    : 0;

  // Convert ms → seconds for motion
  const delaySec = Math.max(0, delayMs) / 1000;

  return (
    <div
      className="content-stretch flex gap-[12px] items-center relative size-full"
      data-name="Progress bar"
    >
      <div
        className="flex-[1_0_0] w-full h-[8px] min-h-px min-w-px relative"
        data-name="Progress bar"
      >
        {/* Background */}
        <div
          className="absolute bg-[#e4e7ec] h-[8px] left-0 right-0 rounded-[9999px] top-0"
          data-name="Background"
        />

        {/* Progress Fill (draws left → right) */}
        <motion.div
          className="absolute h-[8px] left-0 top-0 rounded-[9999px] bg-gradient-to-r from-[#00332a] to-[#037460]"
          data-name="Progress"
          // Use width for the final value, and animate scaleX for a clean "draw" effect
          style={{ width: `${safeTarget}%`, transformOrigin: "left" }}
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={reduceMotion ? false : { scaleX: 1 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.6, // 600ms (within your 500–700ms range)
                  ease: [0.16, 1, 0.3, 1], // smooth, calm ease-out
                  delay: delaySec,
                }
          }
        />
      </div>

      {/* Label */}
      <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#475467] text-[12px] whitespace-nowrap">
        <p className="leading-[20px]">{remainingCount} Remaining</p>
      </div>
    </div>
  );
}
