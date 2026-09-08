import { useEffect, useState } from 'react';

// FloQast logo mark — same paths used in the side nav
const FQ_PATH_LEAF =
  'M11.3041 2.65586e-05L10.694 3.42065H10.4464C9.39082 3.42065 8.4902 4.17407 8.30759 5.20796L8.26608 5.44306H6.01383L5.65967 7.42697H7.91192L7.55084 9.448H5.29859L4.66359 13.0116H2.59534L3.23173 9.448H0L0.359696 7.42697H3.59142L3.9442 5.44306H0.711091L1.0694 3.42065H4.30666L4.91815 2.65586e-05H6.98501L6.37491 3.42065H8.62578L9.23588 2.65586e-05H11.3041Z';
const FQ_PATH_MARK =
  'M10.3334 5.44303L9.97922 7.42694H13.4572L13.0961 9.44797H9.61814L8.98176 13.0116H6.91489L7.55127 9.44797L7.91235 7.42694L8.26651 5.44303L8.30802 5.20793C8.49063 4.17404 9.39126 3.42063 10.4468 3.42063H14.1669L13.8072 5.44303H10.3334ZM23.3737 10.0185C23.1164 10.497 22.8024 10.9204 22.4358 11.2916L23.3447 12.4726L22.5243 13.0968H22.5215C22.5215 13.0968 22.5188 13.1009 22.516 13.1037C21.982 13.5175 21.2156 13.424 20.7936 12.9002H20.7881L20.5197 12.5496C20.1296 12.7077 19.7256 12.8232 19.305 12.8865C18.9896 12.9346 18.6686 12.9442 18.4791 12.9593C17.5218 12.947 16.729 12.7902 16 12.3846C15.3705 12.0341 14.8655 11.5515 14.5045 10.9259C14.189 10.3801 14.0203 9.79031 13.9635 9.16612C13.8625 8.03462 14.095 6.97736 14.6705 5.99435C15.2294 5.04295 16.011 4.32665 16.9933 3.82621C17.5218 3.55674 18.0834 3.37113 18.6714 3.28864C19.5596 3.1649 20.4381 3.19653 21.2903 3.50587C22.3624 3.89357 23.1413 4.60025 23.6117 5.63688C23.8413 6.14283 23.9575 6.6749 23.9894 7.22896C24.0461 8.21748 23.8427 9.14688 23.3724 10.0185H23.3737ZM21.1741 9.65145C21.7897 8.85541 21.9944 7.94801 21.7745 6.95674C21.6251 6.28306 21.2294 5.77574 20.5985 5.47328C20.0645 5.21618 19.4959 5.19418 18.9232 5.29592C18.1111 5.43891 17.454 5.85549 16.9366 6.48104C16.4427 7.07773 16.1964 7.76928 16.1826 8.54882C16.1826 8.82654 16.2186 8.99289 16.2684 9.20875C16.4316 9.92504 16.8439 10.4502 17.5301 10.7417C18.0641 10.9672 18.623 10.9851 19.1833 10.8819C19.1985 10.8792 19.2137 10.8751 19.2289 10.8723L18.3463 9.72431L19.1667 9.09876H19.1694C19.1694 9.09876 19.1722 9.09463 19.175 9.09326C19.7145 8.6753 20.492 8.77154 20.9112 9.30773C20.9154 9.31323 20.9154 9.32011 20.9195 9.32561H20.925L21.1754 9.65282L21.1741 9.65145Z';

interface Props {
  onComplete: () => void;
}

/**
 * AI Scanning intro overlay — recreated from the original Figma Make
 * design. Plays on initial app load: progress climbs 0 → 100 over ~6
 * seconds while phase labels reveal, then the overlay fades out.
 *
 *   - Dark forest-green gradient backdrop (matches side nav)
 *   - Triple rotating rings around the pulsing FloQast logo mark
 *   - Progress bar with animated fill + percent + bouncing dots
 *   - Scanning phases reveal at 0 / 25 / 50 / 75% progress thresholds
 */
export function AIScanningOverlay({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Tiny delay before progress starts so the overlay is visible first
    const startTimeout = setTimeout(() => {
      const tick = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(tick);
            // Hold for half a second, then fade out
            setTimeout(() => setFadingOut(true), 500);
            // After the fade transition, tell the parent we're done
            setTimeout(() => onComplete(), 1100);
            return 100;
          }
          return p + 1;
        });
      }, 60); // 60ms × 100 ≈ 6s
      return () => clearInterval(tick);
    }, 350);

    return () => clearTimeout(startTimeout);
  }, [onComplete]);

  const phases = [
    { label: 'Scanning transaction patterns', show: progress > 0 },
    { label: 'Analyzing approval workflows', show: progress > 25 },
    { label: 'Detecting anomalies', show: progress > 50 },
    { label: 'Calculating severity scores', show: progress > 75 },
  ];

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center transition-opacity duration-600 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #1FAC76 0%, #00332a 60%, #001a14 100%)' }}
    >
      <div className="px-8 text-center">
        {/* Animated scanning circle */}
        <div className="relative mx-auto mb-8 h-32 w-32">
          <div
            className="absolute inset-0 animate-spin rounded-full border-4 border-emerald-400/20"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute inset-2 animate-spin rounded-full border-4 border-emerald-300/20"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          />
          <div
            className="absolute inset-4 animate-spin rounded-full border-4 border-emerald-200/25"
            style={{ animationDuration: '1.5s' }}
          />
          {/* Pulsing FloQast logo mark */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <svg
              viewBox="0 0 23.9986 13.3624"
              width={52}
              height={29}
              fill="none"
            >
              <path d={FQ_PATH_LEAF} fill="#90E39A" />
              <path d={FQ_PATH_MARK} fill="white" />
            </svg>
          </div>
          {/* Ping pulse */}
          <div
            className="absolute inset-0 animate-ping rounded-full bg-emerald-500/15"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Title + subtitle */}
        <h3 className="font-display text-2xl tracking-tight text-white">
          Analyzing financial data
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
          Scanning your accounts and identifying patterns that could
          indicate potential anomalies
        </p>

        {/* Progress bar */}
        <div className="mx-auto mt-6 w-80 max-w-full">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 transition-[width] duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 20px rgba(52, 211, 153, 0.4)',
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="font-mono text-xs text-emerald-300 tabular-nums">
              {progress}%
            </span>
            <div className="flex gap-1">
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-emerald-400"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-emerald-400"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-1 w-1 animate-bounce rounded-full bg-emerald-400"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>

        {/* Phase labels */}
        <div className="mt-8 min-h-[88px] space-y-2">
          {phases.map((p) => (
            <div
              key={p.label}
              className={`flex h-[18px] items-center justify-center gap-2 font-mono text-xs transition-opacity duration-500 ${
                p.show ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-200/80">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
