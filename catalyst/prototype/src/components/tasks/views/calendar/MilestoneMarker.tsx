import { motion } from 'motion/react';
import { Diamond } from 'lucide-react';

interface MilestoneMarkerProps {
  name: string;
  color: string;
  isDrift?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function MilestoneMarker({ name, color, isDrift, style, className = '' }: MilestoneMarkerProps) {
  const displayColor = isDrift ? '#dc2626' : color;

  return (
    <motion.div
      className={`absolute top-0 bottom-0 z-10 pointer-events-none ${className}`}
      style={{ ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div
        className="absolute top-0 bottom-0 w-px border-l border-dashed"
        style={{ borderColor: displayColor }}
      />
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
        <Diamond className="size-3 fill-current" style={{ color: displayColor }} />
        <span
          className="text-[9px] font-semibold whitespace-nowrap px-1 py-0.5 rounded bg-white/90 shadow-sm leading-none"
          style={{ color: displayColor }}
        >
          {name}
        </span>
      </div>
    </motion.div>
  );
}
